import { firebaseApp } from "../../../components/StellarFox"




// ...
export const read = async (uid) => {
    try {
        let snapshot = await firebaseApp.database().ref(`user/${uid}`)
            .once("value")
        return { user: snapshot.val(), }
    } catch (error) {
        return { error: error.message, }
    }
}




// ...
export const update = async (userData) => {
    try {
        const uid = firebaseApp.auth("session").currentUser.uid
        await firebaseApp.database().ref(`user/${uid}`).set(userData)
        return { ok: true, }
    } catch (error) {
        return { error: error.message, }
    }
}
