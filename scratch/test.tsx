import { useReactFlow, NodeResizer } from '@xyflow/react';
export function Test() {
  const { updateNodeData } = useReactFlow();
  return <NodeResizer minWidth={50} minHeight={50} />;
}
