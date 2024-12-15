// src/types/warmup.ts
export interface WarmupStats {
	participant: string;
	totalMessages: number;
	messageTypes: {
		conversation: number;
		imageMessage: number;
		audioMessage: number;
		stickerMessage: number;
		videoMessage: number;
	};
	warmupDuration: number; // em segundos
	firstMessageTimestamp: Date;
	lastMessageTimestamp: Date;
}

export interface InstanceStatus {
	instanceId: string;
	phoneNumber: string;
	connected: boolean;
}
