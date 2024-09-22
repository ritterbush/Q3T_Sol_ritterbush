import { create } from 'zustand'

// const useStore = create((set) => ({
//   bears: 0,
//   increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
//   removeAllBears: () => set({ bears: 0 }),
//   updateBears: (newBears) => set({ bears: newBears }),
// }))
type CreateCampaignState={
    campaignDetails:any
}
type CreateCampaignAction={
    updateCampaginDetails:(campaignDetails: CreateCampaignState['campaignDetails']) => void
}


export const useCreateCampaignStore= create<CreateCampaignState&CreateCampaignAction>((set)=>({
    campaignDetails:{},

    updateCampaginDetails:(items)=>set({campaignDetails:items})

}))
