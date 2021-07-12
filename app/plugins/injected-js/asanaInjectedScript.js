// inspired from manageyum, naughty me
function replacePopupWithRedirect() {
    var google_auth_button = document.getElementById('google_auth_button');
    if (google_auth_button) {
        var str = google_auth_button.getAttribute('onclick');
        str = str.replace('false', 'true');
        google_auth_button.setAttribute('onclick', str);
    }
}

const disconnectedBarClassName = 'DisconnectBar DisconnectBarManager-bar';

// Allow 10s before force reload the page
const reloadIfStuck10SecondsLater = () => setTimeout(
    () => {
        const alwaysDisconnected = !Boolean(document.querySelector('.DisconnectBar Disconnect.BarManager-bar'));

        if (alwaysDisconnected) {
            window.location.reload();
        }
    },
    10000
);

const onAsanaChanges = (mutations, obs) => {
    const disconnectBarManagerNode = document.querySelector('.DisconnectBarManager');

    if (disconnectBarManagerNode) {
        // React lifecycle is not synchrone with DOM mutations
        // so we wait 500ms to ensure that the DOM tree is well drawn before querying it
        setTimeout(
            () => {
                const disconnectBarManagerBarNode = mutations.find(
                    m => Array.from(m.addedNodes).find(n => n.className === disconnectedBarClassName)
                );

                if (disconnectBarManagerBarNode) {
                    reloadIfStuck10SecondsLater();
                }
            },
            500
        );
    }
};

// Will reload the page if we are online and that the reconnection
// banner has been seen for 10sec
// Fix Asana disconnection with retry blocked
const listenBreakingConnection = () => {
    const observer = new MutationObserver(onAsanaChanges);

    const oberverParams = {
        childList: true,
        subtree: true,
    };

    if (navigator.onLine) {
        observer.observe(window.document, oberverParams);
    }

    window.addEventListener('online', () => {
        reloadIfStuck10SecondsLater();
        observer.observe(window.document, oberverParams)
    });

    window.addEventListener('offline', () => observer.disconnect());
}


listenBreakingConnection();

replacePopupWithRedirect();
