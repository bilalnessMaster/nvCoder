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
  Create: (name: string, type: "file" | "folder", parentId: string) => void;
  Toggle: (id: string) => void;
  Delete: (id: string) => void;
  updateContent: (id: string, content: string) => void;
  rename: (id: string, newName: string) => void
}

export const tree = create<TreeProps>((set, get) => ({
  nodes: [],
  Create: (name, type, parentId) => {
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

  Toggle: (id) => {
    const { nodes } = get()

    const toggleNode = (nodes: Node[], id: string): Node[] => {
      return nodes.map(node => {
        if (node.id === id) {
          return {
            ...node, isOpen: !node.isOpen
          }
        }
        if (node.children) {
          return { ...node, children: toggleNode(node.children, id) };
        }
        return node;
      });
    };

    set({
      nodes: toggleNode(nodes, id)
    })
  },

  Delete: (id) => {

    const { nodes } = get()

    const remove = (nodes: Node[]): Node[] => {
      return nodes
        .filter(node => node.id !== id)
        .map(node => ({
          ...node,
          children: node.children ? remove(node.children) : node.children, // recurse
        }));
    };

    set({
      nodes: remove(nodes)
    })

  },

  updateContent: (id, content) => {
    const { nodes } = get();

    const update = (nodes: Node[]): Node[] => {
      return nodes.map(node => {
        if (node.id === id && node.type === "file") {
          return { ...node, content };
        }
        if (node.children) {
          return { ...node, children: update(node.children) };
        }
        return node;
      });
    };

    set({ nodes: update(nodes) });
  },

  rename: (id, newName) => {
    const { nodes } = get();

    const renameNode = (nodes: Node[]): Node[] => {
      return nodes.map(node => {
        if (node.id === id) {
          return { ...node, name: newName };
        }
        if (node.children) {
          return { ...node, children: renameNode(node.children) };
        }
        return node;
      });
    };

    set({ nodes: renameNode(nodes) });
  },
}))
