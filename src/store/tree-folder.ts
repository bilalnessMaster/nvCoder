import { Children } from 'react';
import { create } from 'zustand';

interface Node {
  id: string;
  type: "folder" | "file";
  content?: string;
  name: string;
  children?: Node[];
  isOpen?: boolean;
}
interface TreeProps {
  nodes: Node[];
  create: (name: string, type: "file" | "folder", parentId: string) => void;
  toggle: (id: string) => void;
}

export const tree = create<TreeProps>((set, get) => ({
  nodes: [],
  create: (name, type, parentId) => {
    const { nodes } = get()

    const insert = (nodes: Node[], parentId: string, name: string, type: "file" | "folder"): Node[] => {
      return nodes.map(node => {
        if (node.id === parentId) {
          const newNode: Node = {
            id: Date.now().toString(), // or uuid
            type,
            name,
            content: type === "file" ? "" : undefined,
            children: type === "folder" ? [] : undefined,
          };
          return { ...node, children: [...(node.children ?? []), newNode] };
        }

        if (node.children) {
          return { ...node, children: insert(node.children, parentId, name, type) };
        }

        return node;
      });
    };

    const update = insert(nodes, parentId, name, type)
    set({ nodes: update })
  },
  toggle: (id) => {

  }
}))
