import {
    addAuction,
    getAuctionById,
    getAllAuctions,
    updateAuction,
    deleteAuction,
    getAuctionsByUser,
    closeAuction,
    openAuction,
    getAllBidsByAuctionId,
    updateAllAuctionStatusByTime,
    getAllBiddersAndBidPriceByAuctionId,
}
    from '../services/auctionService';


const auctionController = {
    // Xử lý yêu cầu lấy tất cả các phiên đấu giá
    handleGetAllAuctions: async (req, res) => {
        try {
            const auctions = await getAllAuctions();
            res.status(200).json(auctions);
        } catch (error) {
            console.error('Error getting all auctions:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Lấy các auction đã đăng ký và đang chờ đăng kí của 1 user
    handleGetAuctionsByUser: async (req, res) => {
        try {
            const user_id = req.params.userId
            const auctions = await getAuctionsByUser(user_id);
            res.status(200).json(auctions);
        } catch (error) {
            console.error('Error getting all auctions:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },


    // Xử lý yêu cầu lấy thông tin một phiên đấu giá dựa trên auction_id
    handleGetAuctionById: async (req, res) => {
        const auctionId = req.params.auctionId;
        try {
            const auction = await getAuctionById(auctionId);
            if (auction) {
                res.status(200).json(auction);
            } else {
                res.status(404).json({ error: 'Auction not found' });
            }
        } catch (error) {
            console.error('Error getting auction by ID:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    handleGetAllBidsByAuctionId: async (req, res) => {
        try {
            const auction_id = req.params.auctionId;
            const bids = await getAllBidsByAuctionId(auction_id);
            res.status(200).json(bids);
        } catch (error) {
            console.error('Error getting all bids:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    handleGetAllBiddersAndBidPriceByAuctionId: async (req, res) => {
        try {
            const auction_id = req.params.auctionId;
            const bids = await getAllBiddersAndBidPriceByAuctionId(auction_id);
            res.status(200).json(bids);
        } catch (error) {
            console.error('Error getting all bids:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    // Xử lý yêu cầu tạo một phiên đấu giá mới
    handleCreateNewAuction: async (req, res) => {
        const auctionData = req.body;
        try {
            const { plate_id, start_date, end_date, city, plate_type, vehicle_type } = auctionData;
            const newAuctionId = await addAuction(auctionData);

            await updateAllAuctionStatusByTime();

            res.status(201).json({ message: 'Auction created successfully' });
        } catch (error) {
            console.error('Error creating auction:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Xử lý yêu cầu cập nhật thông tin của một phiên đấu giá dựa trên auction_id
    handleUpdateAuction: async (req, res) => {
        const auctionId = req.params.auctionId;
        const newData = req.body;
        try {
            await updateAuction(auctionId, newData);
            res.status(200).json({ message: 'Auction updated successfully' });
        } catch (error) {
            console.error('Error updating auction:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Xử lý yêu cầu xóa một phiên đấu giá dựa trên auction_id
    handleDeleteAuction: async (req, res) => {
        const auctionId = req.params.auctionId;
        try {
            await deleteAuction(auctionId);
            res.status(200).json({ message: 'Auction deleted successfully' });
        } catch (error) {
            console.error('Error deleting auction:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

};

export default auctionController;
