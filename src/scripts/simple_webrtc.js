const debug = {
    name: {
        string: '[Simple WebRTC]',

        style: {
            color: '#ff69b4',
            'font-weight': '600'
        }
    },

    message: {
        style: {
            color: '#fff'
        }
    },
};

// adds default styles to messages before logging

const parseMessage = (type, message, p1, p2, nameStyles = '') => {
    for (const i of Object.keys(debug.name.style)) 
        nameStyles += `${i}: ${debug.name.style[i]}; `;
    
    console[type](`%c${debug.name.string} %c${message}`, nameStyles );
};


const Debug = {
    log (message) {
		parseMessage('log', message); 
	},

	error (message) {
		parseMessage('error', message);
	},
	
	dir (message)  {
		parseMessage('dir', message);
	},

	warn (message) {
		parseMessage('warn', message);
	},


	// special styles to indicate a specific method being used

	code (code) {
		parseMessage(
			'error', 
			`${code}${''}`);
	},

	table (message) {
		parseMessage('table', message);
	},
};

const Emitter = () => {
    const events = [];

    return {
        on ( event, callback = () => {} ) {
            if (typeof event !== 'string') Debug.error(`Must provide an event string.`);
            events[event] = events[event] || [];
            if (typeof callback !== 'function') Debug.error(`Callback isn't a function,`);
            
            return new Promise(resolve => events[event].push( (...args) => {
                callback(...args);
                resolve(...args);
            }))
        },

        emit ( event, ...args ) {
            if (typeof event !== 'string') Debug.error(`Must provide an event string.`);
            if (!events[event]) return false
            for (const i of events[event]) i(...args);
        },
    }
};

const PeerConnection = ({ emit, on, config }) => {
    const candidates = [];
    const datachannels = [];

    const PeerConnection = new RTCPeerConnection();

    const AddIceCandidate = candidates => {
        if (!candidates) return

        if (Array.isArray(candidates)) 
            for (const candidate of candidates) 
                PeerConnection.addIceCandidate(new RTCIceCandidate(candidate));

        else 
            PeerConnection.addIceCandidate(new RTCIceCandidate(candidates));

        emit('log', 'added ice candidate(s)');
    };

	const AddTrack = ( track, streams = [] ) => {
        if (!track) throw 'no track provided'

        if (!Array.isArray(streams)) streams = [streams];

        PeerConnection.addTrack(track, ...streams);

        emit('log', 'added track(s)');
	};
	
	const CreateDataChannel = () => {
        const DataChannel = PeerConnection.createDataChannel( "main", { reliable: true } );

        const send = async ( data, json = undefined ) => {
            if (!data) throw 'no data provided'

            DataChannel.send(
                ( json !== undefined ? json : config.json )
                    ? JSON.stringify(data)
                    : data
            );
        };

        datachannels.push({ DataChannel, send });

        emit('log', 'created data channel');

        return {
            DataChannel, 
            send
        }
	};


    const SetLocalDescription = async offer => {
        await PeerConnection.setLocalDescription(
			new RTCSessionDescription(offer)
		);

		emit('log', 'set local description');
	};

    const SetRemoteDescription = async offer => {
        await PeerConnection.setRemoteDescription(
			new RTCSessionDescription(offer)
		);

		emit('log', 'set remote description');
	};

	const Broadcast = data => {
		for (const { send } of datachannels) send(data);
	};

    PeerConnection.ondatachannel = event => {
        event.channel.onopen = () => {
            emit('open');
            emit('log', 'datachannel open');
        };

        event.channel.onmessage = async message => {
            const data = JSON.parse(message.data);

            if (data.renegotiation) {
                emit('log', 'renegotiation');

                await AddIceCandidate(data.candidates);

                await SetRemoteDescription(data.sdp);

                if (data.type === 'offer') {
                    emit('log', 'sending renegotiation answer');

                    const answer = await PeerConnection.createAnswer();

                    SetLocalDescription(answer);
            
                    datachannels[0].send(
                        JSON.stringify({
                            type: 'answer',
                            renegotiation: true,
                            sdp: answer
                        }), 
            
                        false
                    );
                }

                else emit('log', 'received renegotiation answer');

                return 
            } else if (data.type === 'icecandidate') {
                emit('log', 'received ice candidate');

                return AddIceCandidate(data.candidate)
            }

            emit(
                'message', 
                
                config.json 
                    ? JSON.parse(message.data)
                    : message.data
            );
        };
    };

    PeerConnection.onerror = event => emit('error', 'PeerConnection', event);
		
    PeerConnection.onicecandidate = event => {
        if (event.candidate) {
            emit('icecandidate', event.candidate);
            candidates.push(event.candidate);
            emit('log', 'found ice candidate');
        }
    };

    PeerConnection.onicegatheringstatechange = event => {
        if (event.target.iceGatheringState === 'complete') {
            emit('icecomplete', event);
            emit('log', 'ice gathering complete');
        }
    };

    PeerConnection.ontrack = event => { 
        emit('track', event);
    };

    PeerConnection.onnegotiationneeded = event => {
        emit('negotiationneeded', event);
        emit('log', 'negotiation needed');
    };

    on('addtrack', ({ track, streams }) => {
        AddTrack(track, ...streams);
    });

    return {
        AddIceCandidate,
        AddTrack,
        CreateDataChannel,
        SetLocalDescription,
        SetRemoteDescription,
        Broadcast,
        raw: PeerConnection,
        candidates,
        datachannels,
    }
};

const UserMedia = ({ emit, on }) => {
	const GetMedia = async ( { video, audio, screen } = { video: false, audio: false }, allow, block ) => {
		try {
			const media = screen 
				? await navigator.mediaDevices.getDisplayMedia({ audio, video })
				: await navigator.mediaDevices.getUserMedia({ audio, video });

			for (const track of media.getTracks()) {
				emit('addtrack', {
					track,
					streams: [media]
				});
			}

			await on('negotiationneeded');
			emit('media-negotiation');

			if (allow) 
				if (typeof allow === 'function') allow(media);
				else throw '`allow` is not of type `function`'

			return media
		} catch (error) {
			if (!error.name || [
				'NotAllowedError',
				'AbortError',
				'NotFoundError',
				'SecurityError'
			].indexOf(error.name) < 0) {
				throw error
			}

			emit('error', 'media.GetMedia', 'unable to access requested media');

			if (block) 
				if (typeof block === 'function') block();
				else throw '`block` is not of type `function`'

			return null
		}
	};

	const microphone = async ( allow, block ) => {
		try {
			return await GetMedia({ audio: true }, allow, block)
		} catch (error) {
			emit('error', 'media.microphone', error);
		}
	};

	const camera = async ( allow, block ) => {
		try {
			return await GetMedia({ video: true }, allow, block)
		} catch (error) {
			emit('error', 'media.camera', error);
		}
	};

	const screen = async ( allow, block ) => {
		try {
			return await GetMedia({ video: true, audio: true, screen: true }, allow, block)
		} catch (error) {
			emit('error', 'media.screen', error);
		}
	};

	const custom = async ( constraints, allow, block ) => {
		try {
			return await GetMedia(constraints, allow, block)
		} catch (error) {
			emit('error', 'media.custom', );
		}
    };
    
    return {
        GetMedia,
        custom,
        screen,
        camera,
        microphone,
    }
};

const Peer = ({ emit: globalEmit, config }) => {
    const { on, emit } = Emitter();

    let icecomplete = false;

    const peerConnection = PeerConnection({ emit, on, config: config.peer });

    peerConnection.CreateDataChannel();

    const offer = async ( ) => {
        const offer = await peerConnection.raw.createOffer();

        peerConnection.SetLocalDescription(offer);

        if (!icecomplete) await on('icecomplete');
        
        const { candidates } = peerConnection;

        return JSON.stringify({
            offer,
            candidates,
            type: 'offer'
        })
    };

    const answer = async offerObject => {
        if (!offerObject) throw 'no offer provided'

        const { offer, candidates } = JSON.parse(offerObject);

        peerConnection.SetRemoteDescription(offer);

        const answer = await peerConnection.raw.createAnswer();

        peerConnection.SetLocalDescription(answer);

        if (!icecomplete) await on('icecomplete');

        peerConnection.AddIceCandidate(candidates);

        return JSON.stringify({
            answer: answer,
            candidates: peerConnection.candidates,
            type: 'answer'
        })
    };
    
    const renegotiate = async ( ) => {
        emit('log', 'renegotiating');
        
        const { offer: newOffer, candidates } = JSON.parse(await offer());
	
		await peerConnection.SetLocalDescription(newOffer);

		send(
			JSON.stringify({
				type: 'offer',
				renegotiation: true,
                sdp: newOffer,
                candidates,
			}), 

			false
		);
    };
    
    const open = answerObject => {
        if (!answerObject) throw 'no answer provided'

        const { answer, candidates } = JSON.parse(answerObject);

        peerConnection.SetRemoteDescription(answer);

        peerConnection.AddIceCandidate(candidates);

        return on('open')
	};

    const send = ( data, json, channel = 0 ) => {
		peerConnection.datachannels[channel].send(data, json);
    };

    on('offer', async offer => send(await answer(offer), false));

    on('icecomplete', () => icecomplete = true);

    on('media-negotiation', async () => renegotiate());
    

    // TODO: test if this works without 'open' event

    on('open', () => {
        on('icecandidate', candidate => {
            if (candidate) send({
                candidate,
                type: 'icecandidate'
            }, true);
        });
    });

    //

    on('log', message => globalEmit('log', message));

    on('error', (code, message) => globalEmit('error', code, message));

    return {
        offer,
        answer, 
        renegotiate,
        open,
        send,
        on,
        emit,
        ...UserMedia({ emit, on, config }),
    }
};

const main = ( options ) => {
    const { emit, on } = Emitter();

	const peers = {};

	const config = {
		log: false,
		debug: false,
		peer: {
			json: true
        },
        ...options
    };

    if (config.debug) {
        on('error', (code, message) => {
            if (message) Debug.code(code,message);
            else Debug.error(code);
        });

        if (config.log) on('log', (message) => {
            Debug.log(message);
        });
    }

    const Broadcast = ( data ) => {
        for (const peer of Object.values(peers))
            peer.send(data);
    };

    return {
        emit,
        on,
        peers,
        Broadcast,
        Peer (name = peers.length) {
            peers[name] = Peer({ emit, config });

            return peers[name]
        }
    }
};

export default main;
