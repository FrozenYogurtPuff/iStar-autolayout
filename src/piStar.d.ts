interface BasicNode {
    id: string;
    text: string;
    type: string;
    x: number;
    y: number;
    customProperties?: any;
}
export interface NodeContainer extends BasicNode {
    nodes?: BasicNode[];
}
interface DependencyNode extends BasicNode {
    source: string;
    target: string;
}
export interface Link {
    id: string;
    type: string;
    source: string;
    target: string;
}
export interface piStarModel {
    actors: NodeContainer[];
    orphans: NodeContainer[];
    dependencies: DependencyNode[];
    links: Link[];
    display: {
        [uuid: string]: {
            collapsed: boolean;
        };
    };
    tool: string;
    istar: string;
    saveDate: string;
    diagram: {
        width: number;
        height: number;
        customProperties?: any;
    };
}
export {};
