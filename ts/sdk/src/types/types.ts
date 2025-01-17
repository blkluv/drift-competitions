import { BN, DataAndSlot, Event } from '@drift-labs/sdk';
import { PublicKey } from '@solana/web3.js';
import { EventEmitter } from 'events';
import StrictEventEmitter from 'strict-event-emitter-types';

export type SponsorInfo = {
	sponsor: PublicKey;
	minSponsorAmount: BN;
	maxSponsorFraction: BN;
};

export class CompetitionStatus {
	static readonly ACTIVE = { active: {} };
	static readonly WINNER_AND_PRIZE_RANDOMNESS_REQUESTED = {
		winnerAndPrizeRandomnessRequested: {},
	};
	static readonly WINNER_AND_PRIZE_RANDOMNESS_COMPLETE = {
		WinnerAndPrizeRandomnessComplete: {},
	};
	static readonly WINNER_SETTLEMENT_COMPLETE = {
		WinnerSettlementComplete: {},
	};
	static readonly EXPIRED = { Expired: {} };
}

export class CompetitorStatus {
	static readonly ACTIVE = { active: {} };
	static readonly DISQUALIFIED = { disqualified: {} };
}

export type Competition = {
	name: number[];
	sponsorInfo: SponsorInfo;
	switchboardFunction: PublicKey;
	switchboardFunctionRequest: PublicKey;
	switchboardFunctionRequestEscrow: PublicKey;
	competitionAuthority: PublicKey;
	numberOfCompetitors: BN;
	numberOfCompetitorsSettled: BN;
	totalScoreSettled: BN;
	maxEntriesPerCompetitor: BN;
	prizeAmount: BN;
	prizeBase: BN;
	winnerRandomness: BN;
	prizeRandomness: BN;
	prizeRandomnessMax: BN;
	outstandingUnclaimedWinnings: BN;
	roundNumber: BN;
	nextRoundExpiryTs: BN;
	competitionExpiryTs: BN;
	roundDuration: BN;
	status: CompetitionStatus;
	competitionAuthorityBump: number;
};

export type Competitor = {
	authority: PublicKey;
	competition: PublicKey;
	userStats: PublicKey;
	minDraw: BN;
	maxDraw: BN;
	unclaimedWinningsBase: BN;
	unclaimedWinnings: BN;
	competitionRoundNumber: BN;
	previousSnapshotScore: BN;
	latestSnapshotScore: BN;
	bonusScore: BN;
	status: CompetitorStatus;
};

/** Events */

export type DriftCompetitionsProgramAccountBaseEvents = {
	update: void;
	error: (e: Error) => void;
};

export type CompetitionAccountEvents =
	DriftCompetitionsProgramAccountBaseEvents & {
		competitionUpdate: (competition: Competition) => void;
	};

export type CompetitorAccountEvents =
	DriftCompetitionsProgramAccountBaseEvents & {
		competitorUpdate: (competitor: Competitor) => void;
	};

export type CompetitionRoundWinnerRecord = {
	roundNumber: BN;
	competitor: PublicKey;
	minDraw: BN;
	maxDraw: BN;
	numberOfCompetitorsSettled: BN;
	winnerRandomness: BN;
	totalScoreSettled: BN;
	prizeRandomness: BN;
	prizeRandomnessMax: BN;
	prizeAmount: BN;
	prizeBase: BN;
	ts: BN;
};

export type CompetitionsEventMap = {
	CompetitionRoundWinnerRecord: Event<CompetitionRoundWinnerRecord>;
};

export type EventType = keyof CompetitionsEventMap;
export type WrappedEvent<Type extends EventType> =
	CompetitionsEventMap[Type] & {
		eventType: Type;
	};
export type WrappedEvents = WrappedEvent<EventType>[];

/** Account Subscribers */

export interface DriftCompetitionsProgramAccountSubscriber<
	Account,
	AccountEvents extends DriftCompetitionsProgramAccountBaseEvents
> {
	eventEmitter: StrictEventEmitter<EventEmitter, AccountEvents>;
	isSubscribed: boolean;

	subscribe(): Promise<boolean>;
	fetch(): Promise<void>;
	updateData(account: Account, slot: number): void;
	unsubscribe(): Promise<void>;
	getAccountAndSlot(): DataAndSlot<Account>;
}

export type CompetitionAccountSubscriber =
	DriftCompetitionsProgramAccountSubscriber<
		Competition,
		CompetitionAccountEvents
	>;

export type CompetitorAccountSubscriber =
	DriftCompetitionsProgramAccountSubscriber<
		Competitor,
		CompetitorAccountEvents
	>;
