import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  AddTier,
  Approval,
  ApprovalForAll,
  DelegateChanged,
  Mint,
  MintReservedToken,
  OwnershipTransferred,
  RemoveTier,
  SetBaseUri,
  SetContractUri,
  SetDefaultReservedTokenBeneficiary,
  SetTokenUriResolver,
  TierDelegateChanged,
  TierDelegateVotesChanged,
  Transfer
} from "../generated/DefifaNFT/DefifaNFT"

export function createAddTierEvent(
  tierId: BigInt,
  data: ethereum.Tuple,
  caller: Address
): AddTier {
  let addTierEvent = changetype<AddTier>(newMockEvent())

  addTierEvent.parameters = new Array()

  addTierEvent.parameters.push(
    new ethereum.EventParam("tierId", ethereum.Value.fromUnsignedBigInt(tierId))
  )
  addTierEvent.parameters.push(
    new ethereum.EventParam("data", ethereum.Value.fromTuple(data))
  )
  addTierEvent.parameters.push(
    new ethereum.EventParam("caller", ethereum.Value.fromAddress(caller))
  )

  return addTierEvent
}

export function createApprovalEvent(
  owner: Address,
  approved: Address,
  tokenId: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromAddress(approved))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return approvalEvent
}

export function createApprovalForAllEvent(
  owner: Address,
  operator: Address,
  approved: boolean
): ApprovalForAll {
  let approvalForAllEvent = changetype<ApprovalForAll>(newMockEvent())

  approvalForAllEvent.parameters = new Array()

  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return approvalForAllEvent
}

export function createDelegateChangedEvent(
  delegator: Address,
  fromDelegate: Address,
  toDelegate: Address
): DelegateChanged {
  let delegateChangedEvent = changetype<DelegateChanged>(newMockEvent())

  delegateChangedEvent.parameters = new Array()

  delegateChangedEvent.parameters.push(
    new ethereum.EventParam("delegator", ethereum.Value.fromAddress(delegator))
  )
  delegateChangedEvent.parameters.push(
    new ethereum.EventParam(
      "fromDelegate",
      ethereum.Value.fromAddress(fromDelegate)
    )
  )
  delegateChangedEvent.parameters.push(
    new ethereum.EventParam(
      "toDelegate",
      ethereum.Value.fromAddress(toDelegate)
    )
  )

  return delegateChangedEvent
}

export function createMintEvent(
  tokenId: BigInt,
  tierId: BigInt,
  beneficiary: Address,
  totalAmountContributed: BigInt,
  caller: Address
): Mint {
  let mintEvent = changetype<Mint>(newMockEvent())

  mintEvent.parameters = new Array()

  mintEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  mintEvent.parameters.push(
    new ethereum.EventParam("tierId", ethereum.Value.fromUnsignedBigInt(tierId))
  )
  mintEvent.parameters.push(
    new ethereum.EventParam(
      "beneficiary",
      ethereum.Value.fromAddress(beneficiary)
    )
  )
  mintEvent.parameters.push(
    new ethereum.EventParam(
      "totalAmountContributed",
      ethereum.Value.fromUnsignedBigInt(totalAmountContributed)
    )
  )
  mintEvent.parameters.push(
    new ethereum.EventParam("caller", ethereum.Value.fromAddress(caller))
  )

  return mintEvent
}

export function createMintReservedTokenEvent(
  tokenId: BigInt,
  tierId: BigInt,
  beneficiary: Address,
  caller: Address
): MintReservedToken {
  let mintReservedTokenEvent = changetype<MintReservedToken>(newMockEvent())

  mintReservedTokenEvent.parameters = new Array()

  mintReservedTokenEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  mintReservedTokenEvent.parameters.push(
    new ethereum.EventParam("tierId", ethereum.Value.fromUnsignedBigInt(tierId))
  )
  mintReservedTokenEvent.parameters.push(
    new ethereum.EventParam(
      "beneficiary",
      ethereum.Value.fromAddress(beneficiary)
    )
  )
  mintReservedTokenEvent.parameters.push(
    new ethereum.EventParam("caller", ethereum.Value.fromAddress(caller))
  )

  return mintReservedTokenEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createRemoveTierEvent(
  tierId: BigInt,
  caller: Address
): RemoveTier {
  let removeTierEvent = changetype<RemoveTier>(newMockEvent())

  removeTierEvent.parameters = new Array()

  removeTierEvent.parameters.push(
    new ethereum.EventParam("tierId", ethereum.Value.fromUnsignedBigInt(tierId))
  )
  removeTierEvent.parameters.push(
    new ethereum.EventParam("caller", ethereum.Value.fromAddress(caller))
  )

  return removeTierEvent
}

export function createSetBaseUriEvent(
  baseUri: string,
  caller: Address
): SetBaseUri {
  let setBaseUriEvent = changetype<SetBaseUri>(newMockEvent())

  setBaseUriEvent.parameters = new Array()

  setBaseUriEvent.parameters.push(
    new ethereum.EventParam("baseUri", ethereum.Value.fromString(baseUri))
  )
  setBaseUriEvent.parameters.push(
    new ethereum.EventParam("caller", ethereum.Value.fromAddress(caller))
  )

  return setBaseUriEvent
}

export function createSetContractUriEvent(
  contractUri: string,
  caller: Address
): SetContractUri {
  let setContractUriEvent = changetype<SetContractUri>(newMockEvent())

  setContractUriEvent.parameters = new Array()

  setContractUriEvent.parameters.push(
    new ethereum.EventParam(
      "contractUri",
      ethereum.Value.fromString(contractUri)
    )
  )
  setContractUriEvent.parameters.push(
    new ethereum.EventParam("caller", ethereum.Value.fromAddress(caller))
  )

  return setContractUriEvent
}

export function createSetDefaultReservedTokenBeneficiaryEvent(
  beneficiary: Address,
  caller: Address
): SetDefaultReservedTokenBeneficiary {
  let setDefaultReservedTokenBeneficiaryEvent = changetype<
    SetDefaultReservedTokenBeneficiary
  >(newMockEvent())

  setDefaultReservedTokenBeneficiaryEvent.parameters = new Array()

  setDefaultReservedTokenBeneficiaryEvent.parameters.push(
    new ethereum.EventParam(
      "beneficiary",
      ethereum.Value.fromAddress(beneficiary)
    )
  )
  setDefaultReservedTokenBeneficiaryEvent.parameters.push(
    new ethereum.EventParam("caller", ethereum.Value.fromAddress(caller))
  )

  return setDefaultReservedTokenBeneficiaryEvent
}

export function createSetTokenUriResolverEvent(
  newResolver: Address,
  caller: Address
): SetTokenUriResolver {
  let setTokenUriResolverEvent = changetype<SetTokenUriResolver>(newMockEvent())

  setTokenUriResolverEvent.parameters = new Array()

  setTokenUriResolverEvent.parameters.push(
    new ethereum.EventParam(
      "newResolver",
      ethereum.Value.fromAddress(newResolver)
    )
  )
  setTokenUriResolverEvent.parameters.push(
    new ethereum.EventParam("caller", ethereum.Value.fromAddress(caller))
  )

  return setTokenUriResolverEvent
}

export function createTierDelegateChangedEvent(
  delegator: Address,
  fromDelegate: Address,
  toDelegate: Address,
  tierId: BigInt,
  caller: Address
): TierDelegateChanged {
  let tierDelegateChangedEvent = changetype<TierDelegateChanged>(newMockEvent())

  tierDelegateChangedEvent.parameters = new Array()

  tierDelegateChangedEvent.parameters.push(
    new ethereum.EventParam("delegator", ethereum.Value.fromAddress(delegator))
  )
  tierDelegateChangedEvent.parameters.push(
    new ethereum.EventParam(
      "fromDelegate",
      ethereum.Value.fromAddress(fromDelegate)
    )
  )
  tierDelegateChangedEvent.parameters.push(
    new ethereum.EventParam(
      "toDelegate",
      ethereum.Value.fromAddress(toDelegate)
    )
  )
  tierDelegateChangedEvent.parameters.push(
    new ethereum.EventParam("tierId", ethereum.Value.fromUnsignedBigInt(tierId))
  )
  tierDelegateChangedEvent.parameters.push(
    new ethereum.EventParam("caller", ethereum.Value.fromAddress(caller))
  )

  return tierDelegateChangedEvent
}

export function createTierDelegateVotesChangedEvent(
  delegate: Address,
  tierId: BigInt,
  previousBalance: BigInt,
  newBalance: BigInt,
  callre: Address
): TierDelegateVotesChanged {
  let tierDelegateVotesChangedEvent = changetype<TierDelegateVotesChanged>(
    newMockEvent()
  )

  tierDelegateVotesChangedEvent.parameters = new Array()

  tierDelegateVotesChangedEvent.parameters.push(
    new ethereum.EventParam("delegate", ethereum.Value.fromAddress(delegate))
  )
  tierDelegateVotesChangedEvent.parameters.push(
    new ethereum.EventParam("tierId", ethereum.Value.fromUnsignedBigInt(tierId))
  )
  tierDelegateVotesChangedEvent.parameters.push(
    new ethereum.EventParam(
      "previousBalance",
      ethereum.Value.fromUnsignedBigInt(previousBalance)
    )
  )
  tierDelegateVotesChangedEvent.parameters.push(
    new ethereum.EventParam(
      "newBalance",
      ethereum.Value.fromUnsignedBigInt(newBalance)
    )
  )
  tierDelegateVotesChangedEvent.parameters.push(
    new ethereum.EventParam("callre", ethereum.Value.fromAddress(callre))
  )

  return tierDelegateVotesChangedEvent
}

export function createTransferEvent(
  from: Address,
  to: Address,
  tokenId: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return transferEvent
}
