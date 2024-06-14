import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Voter } from "./types";

const fetchVoters = async (): Promise<Voter[]> => {
    const { data } = await axios.get("http://localhost:3001/voters"); 
    return data;
};

export const useVoters = () => {
    return useQuery({
        queryKey: ["voters"],
        queryFn: fetchVoters,
    });
};
