class PeerService {
    constructor() {
        if (!this.peer) {
            this.peer = new RTCPeerConnection({
                iceServers: [
                    {
                        urls: [
                            "stun:stun.l.google.com:19302",
                            "stun:global.stun.twilio.com:3478"
                        ]
                    }
                ]
            });
        }
    }

    async getOffer() {
        const offer = await this.peer.createOffer();
        await this.peer.setLocalDescription(offer);
        return offer;
    }

    async getAnswer(offer) {
        await this.peer.setRemoteDescription(offer); // <- offer from remote
        const ans = await this.peer.createAnswer();
        await this.peer.setLocalDescription(ans);
        return ans;
    }

    async setAnswer(ans) {
        // <- this is what you call when you receive answer from remote
        await this.peer.setRemoteDescription(ans);
    }
}

export default new PeerService();


