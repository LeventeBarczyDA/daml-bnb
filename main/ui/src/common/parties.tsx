import { useWellKnownParties } from "@daml/dabl-react"
import { isLocalDev } from "../config"
import { useEffect, useState } from "react";

type Result = {
    parties: {
        userAdminParty: string;
        publicParty: string;
    };
    loading: boolean;
    error: string | null;
}

export const useDablParties = () => {
    const { parties, loading, error } = useWellKnownParties();
    const [result, setResult] = useState<Result>({ parties: devParties, loading: true, error: null });

    useEffect(() => {
        if (!isLocalDev) {
            if (error && !loading) {
                console.error(`Error fetching DABL parties: ${error}`);
            }

            parties && setResult({ parties, loading, error });
        } else {
            setResult({ parties: devParties, loading: false, error: null });
        }
    }, [parties, loading, error]);

    return result;
}

const devParties = {
    userAdminParty: "Operator",
    publicParty: "Public"
}
