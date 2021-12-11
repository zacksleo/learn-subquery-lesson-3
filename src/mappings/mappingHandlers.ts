import { SubstrateExtrinsic, SubstrateEvent, SubstrateBlock } from "@subql/types";
import { Block, StackingReward } from "../types";
import { Balance } from "@polkadot/types/interfaces";


export async function handleBlock(block: SubstrateBlock): Promise<void> {
    //Create a new starterEntity with ID using block hash
    let record = new Block(block.block.header.hash.toString());
    //Record block number
    record.number = block.block.header.number.toNumber();
    record.hash = block.block.hash.toString();
    record.parentHash = block.block.header.parentHash.toString();
    record.timestamp = block.timestamp;

    await record.save();
}

export async function handleStackingEvent(event: SubstrateEvent): Promise<void> {
    const { event: { data: [account, newReword] } } = event;
    //Retrieve the record by its ID
    const record = new StackingReward(`${event.block.block.header.number}-${event.idx.toString()}`);
    record.address = account.toString();
    record.balance = (newReword as Balance).toBigInt();
    record.date = event.block.timestamp;
    await record.save();
}

