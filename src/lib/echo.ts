import Echo from "laravel-echo";
import Pusher, {
	type AuthorizerCallback,
	type Channel,
} from "pusher-js";
import { getItem } from "../utils/localStorageUtil";
import type { Token } from "../types/user";

declare global {
	interface Window {
		Pusher: typeof Pusher;
	}
}

window.Pusher = Pusher;

let echoInstance: Echo<"reverb"> | null = null;

export function getEcho(): Echo<"reverb"> {
	if (echoInstance) return echoInstance;

	const appKey = import.meta.env.VITE_REVERB_APP_KEY as string | undefined;
	if (!appKey) {
		throw new Error(
			"[Echo] VITE_REVERB_APP_KEY is not set. Add it to your .env file."
		);
	}

	echoInstance = new Echo<"reverb">({
		broadcaster: "reverb",
		key: appKey,
		wsHost: import.meta.env.VITE_REVERB_HOST as string,
		wsPort: Number(import.meta.env.VITE_REVERB_PORT ?? 8080),
		wssPort: Number(import.meta.env.VITE_REVERB_PORT ?? 8080),
		forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? "http") === "https",
		enabledTransports: ["ws", "wss"],
		authorizer: (channel: Channel) => ({
			authorize: (socketId: string, callback: AuthorizerCallback) => {
				const token = getItem<Token>("token");
				const baseUrl = (import.meta.env.VITE_API_BASE_URL as string) ?? "";

				fetch(`${baseUrl}/broadcasting/auth`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
						...(token?.access_token
							? { Authorization: `Bearer ${token.access_token}` }
							: {}),
					},
					body: JSON.stringify({
						socket_id: socketId,
						channel_name: channel.name,
					}),
				})
					.then((res) => {
						if (!res.ok)
							throw new Error(`Broadcasting auth failed: ${res.status}`);
						return res.json();
					})
					.then((data) => callback(null, data))
					.catch((err: Error) => callback(err, null));
			},
		}),
	});

	return echoInstance;
}

export function disconnectEcho(): void {
	if (echoInstance) {
		echoInstance.disconnect();
		echoInstance = null;
	}
}
