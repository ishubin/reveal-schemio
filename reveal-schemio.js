
const RevealSchemio = (() => {
    let currentSchemioSlide = null;

    function nextSlide(deck) {
        if (!currentSchemioSlide) {
            deck.next();
            return;
        }
        currentSchemioSlide.frameIdx++;
        if (currentSchemioSlide.frameIdx < currentSchemioSlide.frameEvents.length) {
            currentSchemioSlide.iframe.contentWindow.postMessage({
                type : 'item-event',
                name : currentSchemioSlide.itemName,
                event: currentSchemioSlide.frameEvents[currentSchemioSlide.frameIdx]
            }, '*');
        } else {
            deck.next();
        }
    }

    function destroySchemioPlayer(playerContainer) {
        if (playerContainer.querySelector('iframe.schemio-player')) {
            playerContainer.innerHTML = '';
        }
    }

    function loadSchemioPlayer(playerContainer) {
        const url = playerContainer.getAttribute('data-url');

        playerContainer.innerHTML = '';
        const loadingContainer = document.createElement('div');
        loadingContainer.classList.add('schemio-player-spinner-container');
        const loadingIcon = document.createElement('span');
        loadingIcon.classList.add('schemio-player-spinner');
        loadingContainer.appendChild(loadingIcon);


        const iframe = document.createElement('iframe');
        iframe.classList.add('schemio-player');
        iframe.setAttribute('width', '100%');
        iframe.setAttribute('height', '100%');
        let loadWasCalled = false
        iframe.addEventListener('load', () => {
            if (loadWasCalled) {
                playerContainer.removeChild(loadingContainer);
            } else {
                loadWasCalled = true;
            }
        }, true);

        playerContainer.appendChild(iframe);
        playerContainer.appendChild(loadingContainer);

        iframe.src = url;

        let frameEvents = [];

        const encodedFrameEvents = playerContainer.getAttribute('data-frame-events');
        if (encodedFrameEvents && encodedFrameEvents.trim()) {
            frameEvents = encodedFrameEvents.split(',').map(frameEvent => frameEvent.trim());
        } else {
            const totalFrames = parseInt(playerContainer.getAttribute('data-frames'));
            const framePrefix = playerContainer.getAttribute('data-frame-prefix') || 'Frame ';
            for (let i = 1; i <= totalFrames; i++) {
                frameEvents.push(`${framePrefix}${i}`);
            }
        }

        currentSchemioSlide = {
            playerContainer,
            iframe,
            itemName: playerContainer.getAttribute('data-item-name') || 'GlobalEventHandler',
            frameIdx: -1,
            frameEvents,
            endingFrame: playerContainer.getAttribute('data-frame-end')
        };
    }


    return {
        id: 'schemio',
        init: (deck) => {
            deck.on('slidechanged', (event) => {
                const slideSection = deck.getCurrentSlide();
                if (currentSchemioSlide) {
                    destroySchemioPlayer(currentSchemioSlide.playerContainer);
                    currentSchemioSlide = null;
                }
                const playerContainer = slideSection.querySelector('.schemio-player');
                if (playerContainer) {
                    loadSchemioPlayer(playerContainer);
                }
            });

            window.addEventListener('message', (event) => {
                if (!currentSchemioSlide) {
                    return;
                }
                if (!event.data || event.data.type !== 'schemio:item-event') {
                    return;
                }
                const data = event.data;
                if (data.name !== currentSchemioSlide.itemName) {
                    return;
                }

                for (let i = 0; i < currentSchemioSlide.frameEvents.length; i++) {
                    if (currentSchemioSlide.frameEvents[i] === data.event) {
                        currentSchemioSlide.frameIdx = i;
                    }
                }

                if (currentSchemioSlide.endingFrame && currentSchemioSlide.endingFrame === data.event) {
                    deck.next();
                }
            });


            deck.removeKeyBinding(32);
            deck.removeKeyBinding(39);

            deck.addKeyBinding(32, () => {
                nextSlide(deck);
            });
            deck.addKeyBinding(39, () => {
                nextSlide(deck);
            });
        },
    };
})();