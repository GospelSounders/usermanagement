import { QSpinnerGears } from "quasar";

const Events = require("./EventEmitter").default;
const cryptoRandomString = require('crypto-random-string');



class dialog extends Events {
    constructor() {
        super()
    }

    async confirm(quasar, message, title = "Confirm") {
        return new Promise((resolve, reject) => {
            quasar.$q
                .dialog({
                    title,
                    message,
                    cancel: true,
                    persistent: true,
                })
                .onOk(() => {
                    return resolve(true);
                })
                .onOk(() => {
                    return resolve(true);
                })
                .onCancel(() => {
                    return reject(true);
                })
                .onDismiss(() => {
                    return reject(true);
                });
        });
    }

    showDialog(quasar, title = "", message = "", counter = 0) {
        let dialogId = cryptoRandomString({ length: 10 });

        // quasar.working = true;
        const dialog = quasar.$q.dialog({
            title,
            message,
            progress: {
                spinner: QSpinnerGears,
                color: "primary",
            },
            persistent: true, // we want the user to not be able to close it
            ok: false, // we want the user to not be able to close it
        });
        let secsElapsed = counter;
        dialog.update({
            message: `${secsElapsed} secs`,
        });
        let interval, updateSecs;
        const closeDialog = () => {
            clearInterval(interval);
            clearInterval(updateSecs);
            dialog.hide();
        };
        updateSecs = setInterval(() => {
            if (counter > 0) {
                secsElapsed--;
                if (secsElapsed === 0) {
                    closeDialog();
                }
            } else {
                secsElapsed++;
            }
            dialog.update({
                message: `${secsElapsed} secs`,
            });
        }, 1000);
        this.once(dialogId, closeDialog)
        return dialogId;
        // interval = setInterval(() => {
        //     if (quasar.working === false) {
        //         closeDialog();
        //     }
        // }, 500);
    }

}

export default new dialog();