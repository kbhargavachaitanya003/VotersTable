import { create } from "zustand";
import { Voter } from "../Components/types";

interface Store {
    voters: Voter[];
    setVoters: (voters : Voter[]) => void;
};

export const useVoterStore = create<Store>((set) => ({
    voters: [],
    setVoters: (voters) => set({ voters })
}));
