// This file was generated by Mendix Modeler.
//
// WARNING: Only the following code will be retained when actions are regenerated:
// - the code between BEGIN USER CODE and END USER CODE
// Other code you write will be lost the next time you deploy the project.

import TouchID from "react-native-touch-id";

/**
 * @returns {Promise.<boolean>}
 */
export async function IsBiometricAuthenticationSupported(): Promise<boolean> {
    // BEGIN USER CODE
    // Documentation https://github.com/naoufal/react-native-touch-id

    return TouchID.isSupported()
        .then(() => true)
        .catch(() => false);

    // END USER CODE
}