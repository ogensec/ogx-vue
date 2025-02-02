import { MemoryEntity } from "@ogen-core";

export type T{{EntityName}}Entity = {
	uid: string;

} & MemoryEntity<any>

export default class {{EntityName}}Entity extends MemoryEntity<T{{EntityName}}Entity> {
	
	static indexer = ['uid'];
	
	static fields = {
		uid: null
		
	}
	
	constructor(data: any) {
		super(data);
	}
}