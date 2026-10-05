import { CanvasNode, CanvasEdge, NODE_COLORS } from "@/types/canvas";

export type CanvasTemplate = {
  id: string;
  name: string;
  description: string;
  nodes: CanvasNode[];
  edges: CanvasEdge[];
};

const blue = NODE_COLORS[1].fill;
const purple = NODE_COLORS[2].fill;
const green = NODE_COLORS[6].fill;
const orange = NODE_COLORS[3].fill;
const defaultColor = NODE_COLORS[0].fill;

const gray = "#404040";
const red = NODE_COLORS[4]?.fill || "#EF4444";

export const CANVAS_TEMPLATES: CanvasTemplate[] = [
  {
    id: "microservices",
    name: "Microservices",
    description: "API Gateway routes traffic to isolated services, each backed by a dedicated database and connected via a shared message bus.",
    nodes: [
      { id: "client", type: "canvasNode", position: { x: 50, y: 150 }, data: { label: "Client", shape: "pill", color: blue } },
      { id: "api-gateway", type: "canvasNode", position: { x: 250, y: 150 }, data: { label: "API Gateway", shape: "hexagon", color: green } },
      { id: "message-bus", type: "canvasNode", position: { x: 250, y: 350 }, data: { label: "Message Bus", shape: "hexagon", color: purple } },
      
      { id: "service-1", type: "canvasNode", position: { x: 450, y: 50 }, data: { label: "Service A", shape: "rectangle", color: purple } },
      { id: "service-2", type: "canvasNode", position: { x: 450, y: 150 }, data: { label: "Service B", shape: "rectangle", color: purple } },
      { id: "service-3", type: "canvasNode", position: { x: 450, y: 250 }, data: { label: "Service C", shape: "rectangle", color: purple } },
      { id: "service-4", type: "canvasNode", position: { x: 450, y: 350 }, data: { label: "Service D", shape: "rectangle", color: purple } },
      
      { id: "db-1", type: "canvasNode", position: { x: 650, y: 50 }, data: { label: "Database A", shape: "rectangle", color: gray } },
      { id: "db-2", type: "canvasNode", position: { x: 650, y: 150 }, data: { label: "Database B", shape: "rectangle", color: gray } },
      { id: "db-3", type: "canvasNode", position: { x: 650, y: 250 }, data: { label: "Database C", shape: "rectangle", color: gray } },
      { id: "db-4", type: "canvasNode", position: { x: 650, y: 350 }, data: { label: "Database D", shape: "rectangle", color: gray } },
    ],
    edges: [
      { id: "e1", source: "client", target: "api-gateway", type: "canvasEdge" },
      { id: "e2", source: "api-gateway", target: "service-1", type: "canvasEdge" },
      { id: "e3", source: "api-gateway", target: "service-2", type: "canvasEdge" },
      { id: "e4", source: "api-gateway", target: "service-3", type: "canvasEdge" },
      { id: "e5", source: "api-gateway", target: "service-4", type: "canvasEdge" },
      
      { id: "e6", source: "service-1", target: "db-1", type: "canvasEdge" },
      { id: "e7", source: "service-2", target: "db-2", type: "canvasEdge" },
      { id: "e8", source: "service-3", target: "db-3", type: "canvasEdge" },
      { id: "e9", source: "service-4", target: "db-4", type: "canvasEdge" },

      { id: "e10", source: "service-1", target: "message-bus", type: "canvasEdge" },
      { id: "e11", source: "service-2", target: "message-bus", type: "canvasEdge" },
      { id: "e12", source: "service-3", target: "message-bus", type: "canvasEdge" },
      { id: "e13", source: "service-4", target: "message-bus", type: "canvasEdge" },
    ]
  },
  {
    id: "cicd",
    name: "CI/CD Pipeline",
    description: "End-to-end delivery from source commit through build, test, containerisation, and staged deployment to production.",
    nodes: [
      { id: "repo", type: "canvasNode", position: { x: 50, y: 150 }, data: { label: "Source", shape: "rectangle", color: blue } },
      { id: "build", type: "canvasNode", position: { x: 220, y: 150 }, data: { label: "Build", shape: "rectangle", color: green } },
      { id: "test-1", type: "canvasNode", position: { x: 390, y: 150 }, data: { label: "Test", shape: "rectangle", color: purple } },
      { id: "test-2", type: "canvasNode", position: { x: 560, y: 150 }, data: { label: "Containerise", shape: "rectangle", color: purple } },
      { id: "stage", type: "canvasNode", position: { x: 730, y: 150 }, data: { label: "Stage", shape: "rectangle", color: orange } },
      { id: "approve", type: "canvasNode", position: { x: 900, y: 150 }, data: { label: "Approve", shape: "diamond", color: red } },
      { id: "prod", type: "canvasNode", position: { x: 1070, y: 150 }, data: { label: "Production", shape: "rectangle", color: green } },
    ],
    edges: [
      { id: "e1", source: "repo", target: "build", type: "canvasEdge" },
      { id: "e2", source: "build", target: "test-1", type: "canvasEdge" },
      { id: "e3", source: "test-1", target: "test-2", type: "canvasEdge" },
      { id: "e4", source: "test-2", target: "stage", type: "canvasEdge" },
      { id: "e5", source: "stage", target: "approve", type: "canvasEdge" },
      { id: "e6", source: "approve", target: "prod", type: "canvasEdge" },
    ]
  },
  {
    id: "event-driven",
    name: "Event-Driven System",
    description: "Producers publish events to a central bus. Independent consumers handle emails, push notifications, analytics, and error queues.",
    nodes: [
      { id: "producer-1", type: "canvasNode", position: { x: 50, y: 50 }, data: { label: "Web", shape: "pill", color: blue } },
      { id: "producer-2", type: "canvasNode", position: { x: 50, y: 150 }, data: { label: "Mobile", shape: "pill", color: blue } },
      { id: "producer-3", type: "canvasNode", position: { x: 50, y: 250 }, data: { label: "API", shape: "pill", color: blue } },
      
      { id: "event-bus", type: "canvasNode", position: { x: 280, y: 150 }, data: { label: "Event Bus", shape: "hexagon", color: purple } },
      
      { id: "consumer-1", type: "canvasNode", position: { x: 510, y: 50 }, data: { label: "Analytics", shape: "rectangle", color: green } },
      { id: "consumer-2", type: "canvasNode", position: { x: 510, y: 150 }, data: { label: "Notifications", shape: "rectangle", color: green } },
      { id: "consumer-3", type: "canvasNode", position: { x: 510, y: 250 }, data: { label: "Error Queue", shape: "rectangle", color: red } },
      
      { id: "db-1", type: "canvasNode", position: { x: 740, y: 50 }, data: { label: "Data Lake", shape: "rectangle", color: gray } },
      { id: "db-2", type: "canvasNode", position: { x: 740, y: 150 }, data: { label: "User DB", shape: "rectangle", color: gray } },
    ],
    edges: [
      { id: "e1", source: "producer-1", target: "event-bus", type: "canvasEdge" },
      { id: "e2", source: "producer-2", target: "event-bus", type: "canvasEdge" },
      { id: "e3", source: "producer-3", target: "event-bus", type: "canvasEdge" },
      
      { id: "e4", source: "event-bus", target: "consumer-1", type: "canvasEdge" },
      { id: "e5", source: "event-bus", target: "consumer-2", type: "canvasEdge" },
      { id: "e6", source: "event-bus", target: "consumer-3", type: "canvasEdge" },
      
      { id: "e7", source: "consumer-1", target: "db-1", type: "canvasEdge" },
      { id: "e8", source: "consumer-2", target: "db-2", type: "canvasEdge" },
    ]
  }
];

