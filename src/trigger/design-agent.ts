import { logger, task } from "@trigger.dev/sdk";
import { generateObject } from 'ai';
import { groq } from '@ai-sdk/groq';
import { getLiveblocks } from "@/lib/liveblocks";
import { LiveObject } from "@liveblocks/node";
import { z } from 'zod';

export const designAgent = task({
  id: "design-agent",
  run: async (payload: { prompt: string; roomId: string }) => {
    logger.log("Running design agent", { payload });
    const { prompt, roomId } = payload;
    const liveblocks = getLiveblocks();

    try {
      // Set AI presence
      await liveblocks.setPresence(roomId, {
        userId: "agent",
        userInfo: {
          name: "Design AI",
          color: "#E11D48",
        },
        data: {
          cursor: { x: 400, y: 300 },
          thinking: true,
        }
      });

      // Broadcast start status
      await liveblocks.broadcastEvent(roomId, {
        type: "ai-status-feed",
        status: "Analyzing",
        text: "Thinking about your request..."
      });

      // Fetch current canvas state
      const roomStorage = await liveblocks.getStorageDocument(roomId, "json") as any;
      const currentNodes = roomStorage?.flow?.nodes || {};
      const currentEdges = roomStorage?.flow?.edges || {};
      const currentState = JSON.stringify({ nodes: currentNodes, edges: currentEdges });

      const result = await generateObject({
        model: groq('llama-3.3-70b-versatile'),
        prompt: `You are an expert system architect collaborating on a canvas. Current task/message: "${prompt}".

IMPORTANT ROLE RESTRICTION: You are STRICTLY a system architecture and software design assistant. If the user asks about ANY topic unrelated to software architecture, system design, programming, or the canvas (e.g., cooking, recipes, general knowledge, pop culture), you MUST politely refuse to answer and remind them of your specific role as a Design AI. Leave the 'actions' array empty in this case.

If the user is just greeting you or asking a relevant question that doesn't require modifying the canvas architecture, leave the 'actions' array empty and reply conversationally in the 'message' field.

If the user wants you to design or modify an architecture:
1. Figure out the key components (e.g., frontend, API, database, cache) and choose appropriate shapes (e.g., 'cylinder' for databases, 'rectangle' for services, 'pill' for frontends, 'diamond' for queues).
2. Choose appropriate colors to distinguish different layers or services.
3. Lay them out logically with good spacing (e.g., width 150, height 80, spacing them by 200px horizontally and vertically). Usually, data flows from left to right or top to bottom.
4. Connect related components with edges, adding labels to edges if the relationship is specific (e.g., 'reads from', 'publishes to').
5. Explain your design in the 'message' field.

Allowed node shapes: rectangle, diamond, circle, pill, cylinder, hexagon.
Allowed colors (fill): '#1F1F1F' (default/neutral), '#10233D' (blue), '#2E1938' (purple), '#331B00' (orange), '#3C1618' (red), '#3A1726' (pink), '#0F2E18' (green), '#062822' (teal).

Here is the current canvas state:
${currentState}

Determine what actions are needed on the canvas. You can add, update, move, or delete nodes and edges.
`,
        schema: z.object({
          message: z.string().describe("The conversational response or explanation of the architecture design."),
          actions: z.array(z.discriminatedUnion('type', [
            z.object({
              type: z.literal('addNode'),
              id: z.string(),
              shape: z.enum(['rectangle', 'diamond', 'circle', 'pill', 'cylinder', 'hexagon']),
              color: z.enum(['#1F1F1F', '#10233D', '#2E1938', '#331B00', '#3C1618', '#3A1726', '#0F2E18', '#062822']).nullable(),
              label: z.string(),
              x: z.number(),
              y: z.number(),
              width: z.number(),
              height: z.number(),
            }),
            z.object({
              type: z.literal('updateNode'),
              id: z.string(),
              label: z.string().nullable(),
              shape: z.enum(['rectangle', 'diamond', 'circle', 'pill', 'cylinder', 'hexagon']).nullable(),
              color: z.enum(['#1F1F1F', '#10233D', '#2E1938', '#331B00', '#3C1618', '#3A1726', '#0F2E18', '#062822']).nullable(),
              x: z.number().nullable(),
              y: z.number().nullable(),
              width: z.number().nullable(),
              height: z.number().nullable(),
            }),
            z.object({
              type: z.literal('deleteNode'),
              id: z.string(),
            }),
            z.object({
              type: z.literal('addEdge'),
              id: z.string(),
              source: z.string(),
              target: z.string(),
              label: z.string().nullable(),
            }),
            z.object({
              type: z.literal('deleteEdge'),
              id: z.string(),
            }),
          ]))
        })
      });

      // Broadcast processing status
      await liveblocks.broadcastEvent(roomId, {
        type: "ai-status-feed",
        status: "Applying",
        text: "Updating canvas..."
      });

      // Update Canvas
      if (result.object.actions && result.object.actions.length > 0) {
        await liveblocks.mutateStorage(roomId, ({ root }) => {
          // @liveblocks/react-flow uses "flow" as the default storageKey
          const flow = (root as any).get("flow");
          if (!flow) return;
          
          const nodesMap = flow.get("nodes");
          const edgesMap = flow.get("edges");

          if (nodesMap && edgesMap) {
            result.object.actions.forEach((action) => {
              if (action.type === 'addNode') {
                nodesMap.set(action.id, new LiveObject({
                  id: action.id,
                  type: "canvasNode",
                  position: { x: action.x, y: action.y },
                  data: { label: action.label, shape: action.shape, color: action.color ?? '#1F1F1F' },
                  style: { width: action.width, height: action.height }
                }));
              } else if (action.type === 'updateNode') {
                const node = nodesMap.get(action.id);
                if (node) {
                  if (action.label != null || action.shape != null || action.color != null) {
                    const data = node.get("data") || {};
                    node.set("data", {
                      ...data,
                      ...(action.label != null && { label: action.label }),
                      ...(action.shape != null && { shape: action.shape }),
                      ...(action.color != null && { color: action.color }),
                    });
                  }
                  if (action.x != null || action.y != null) {
                    const pos = node.get("position") || {};
                    node.set("position", {
                      ...pos,
                      ...(action.x != null && { x: action.x }),
                      ...(action.y != null && { y: action.y }),
                    });
                  }
                  if (action.width != null || action.height != null) {
                    const style = node.get("style") || {};
                    node.set("style", {
                      ...style,
                      ...(action.width != null && { width: action.width }),
                      ...(action.height != null && { height: action.height }),
                    });
                  }
                }
              } else if (action.type === 'deleteNode') {
                nodesMap.delete(action.id);
                // Also cleanup edges connected to this node
                const edgesToDelete: string[] = [];
                for (const [edgeId, edge] of edgesMap.entries()) {
                  if (edge.get("source") === action.id || edge.get("target") === action.id) {
                    edgesToDelete.push(edgeId);
                  }
                }
                edgesToDelete.forEach(id => edgesMap.delete(id));
              } else if (action.type === 'addEdge') {
                edgesMap.set(action.id, new LiveObject({
                  id: action.id,
                  source: action.source,
                  target: action.target,
                  type: "canvasEdge",
                  data: { label: action.label || "" }
                }));
              } else if (action.type === 'deleteEdge') {
                edgesMap.delete(action.id);
              }
            });
          }
        });
      }

      // Broadcast completion message
      await liveblocks.broadcastEvent(roomId, {
        type: "ai-chat",
        sender: "Design AI",
        role: "ai",
        content: result.object.message || "I've updated the canvas according to your request.",
        timestamp: Date.now()
      });

    } catch (error) {
      logger.error("AI Generation failed", { error });
      await liveblocks.broadcastEvent(roomId, {
        type: "ai-chat",
        sender: "Design AI",
        role: "ai",
        content: "Sorry, I encountered an error while designing the architecture.",
        timestamp: Date.now()
      });
    } finally {
      // Clear AI presence
      await liveblocks.setPresence(roomId, {
        userId: "agent",
        userInfo: {
          name: "Design AI",
          color: "#E11D48",
        },
        data: { cursor: null, thinking: false }
      });
    }

    return { success: true };
  },
});
