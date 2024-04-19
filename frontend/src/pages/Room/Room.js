import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import Input from '~/components/Input';
import Button from '~/components/Button';
import Modal from '~/components/Modal';
import BidResult from '~/components/Form/BidResult';
import config from '~/config';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { authUserContext } from '~/App';

import * as bidService from '~/services/bidService';

function Room() {
    const location = useLocation();
    const item = location.state;
    const context = useContext(authUserContext);
    const user = context && context.authUser?.user;
    const token = context && context.authUser?.token;

    const [bid, setBid] = useState('');
    const [allBids, setAllBids] = useState();

    const [showModal, setShowModal] = useState(false);
    const [win, setWin] = useState(false);

    const fetchData = () => {
        bidService
            .getAllBids(token)
            .then((data) => {
                // Sort data: Giảm dần
                data.sort((a, b) => (b.bid_price - a.bid_price))
                // Filter data by: auction_id
                data = data.filter((bid) => (bid.auction_id === item.auction_id));
                // console.log('[ROOM]',  data);
                if (data.length > 0) setAllBids(data.slice(0, 3));
                else setAllBids();
            });
    }

    useEffect(() => {
        if (item) fetchData();
    }, []);
    
    const inputCurrency = (value) => {
        value =  value.replace(/[^0-9\s]/g, '');
        value =  value.replaceAll(',', '');
        const len = value.length;
    
        let count = 0;
            
        for (let i = 1; i <= ((len % 3 === 0) ? Math.floor(len / 3) - 1 : Math.floor(len / 3)); i++) {
            const position = - (i * 3 + count);
            value = `${value.slice(0, position)},${value.slice(position)}`;
            count++;
        }
    
        return value;
    }

    const inputPhone = (value) => {
        value = value.replace(/[^0-9\s]/g, '');
        value = value.replaceAll(' ', '');
        const len = value.length;
    
        let count = 0;
    
        for (let i = 1; i <= ((len % 4 === 0) ? Math.floor(len / 4) - 1 : Math.floor(len / 4)); i++) {
            const position = i * 4 + count;
            value = `${value.slice(0, position)} ${value.slice(position)}`;
            count++;
        }
    
        return value;
    }

    const validation = () => {
        if (!item) {
            toast.error('Vui lòng chọn biển số để đấu giá!');
            return false;
        }
        if (bid === '') {
            toast.error('Vui lòng nhập Số tiền!');
            return false;
        }
        if (allBids && (Number(bid.replaceAll(',', '')) < allBids[0].bid_price)) {
            toast.error('Vui lòng nhập Số tiền lớn hơn Giá hiện tại!');
            return false;
        }
        return true;
    }

    const handleSubmit = () => {
        // console.log('[ROOM]', item);
        if (validation()) {
            bidService
                .createBid(
                    item.auction_id, 
                    user.phone_number, 
                    Number(bid.replaceAll(',', '')),
                )
                .then((data) => {
                    if (data && data?.message) {
                        toast.success(data.message);
                    } else if (data && data?.error) {
                        toast.error(data.error);
                    }
                    setBid('');
                    fetchData();
                });
        }
    }

    const handleShowModal = () => {
        setShowModal(true);
    } 

    const handleCloseModal = () => {
        setShowModal(false);
    }

    return (
        <div className='px-32 py-16'>
            <div>
                <div className='grid grid-cols-[auto_45%] gap-16'>
                    <div className='px-32 py-8 min-h-[367px] rounded-[10px] shadow-[0_4px_20px_var(--shadow-color)]'>
                        <div className='mx-auto px-16 py-4 w-fit text-center border-[0px] border-[var(--primary)] rounded-[6px]'>
                            <h3 className='text-[20px] uppercase font-semibold'>Thời gian đấu giá còn lại</h3>
                            <div className='flex justify-evenly'>
                                {/* {(item && '10:00') || '00:00'} */}
                                <span className='flex flex-col items-center'>
                                    <span className='text-[60px] leading-[60px] text-[var(--primary)] font-["UKNumberPlate"]'>
                                        {(item && '10') || '00'}
                                    </span>
                                    <span className='text-[16px] leading-[18px] font-normal'>Phút</span>
                                </span>
                                <span className='text-[60px] leading-[60px] text-[var(--primary)] font-["UKNumberPlate"]'>:</span>
                                <span className='flex flex-col items-center'>
                                    <span className='text-[60px] leading-[60px] text-[var(--primary)] font-["UKNumberPlate"]'>
                                        {(item && '00') || '00'}
                                    </span>
                                    <span className='text-[16px] leading-[18px] font-normal'>Giây</span>
                                </span>
                            </div>
                        </div>
                        {item ? (
                            <div className='flex flex-col justify-center items-center mt-16 mx-auto px-8 w-fit border-[4px] border-[var(--black)] aspect-[2/1] rounded-[6px]'>
                                <div className='text-[64px] leading-[64px] font-["UKNumberPlate"]'>
                                    {item.plate_id.split('-').shift()}
                                </div>
                                <div className='text-[64px] leading-[64px] font-["UKNumberPlate"]'>
                                    {item.plate_id.split('-').pop()}
                                </div>
                            </div>
                        ) : (
                            <div className='flex flex-col justify-center items-center mt-16 mx-auto px-8 w-fit border-[4px] border-[var(--black)] aspect-[2/1] rounded-[6px]'>
                                <h3 className='text-[20px]'>Vui lòng chọn biển số để đấu giá</h3>
                                <Button className='mt-4 p-[9px_16px]' to={config.routes.auction} primary>Chọn biển số</Button>
                            </div>
                        )}
                    </div>
                    <div className='px-16 py-8 min-h-[367px]'>
                        <h3 className='text-[20px] uppercase font-semibold text-center'>Diễn biến đấu giá</h3>
                        <div className='min-h-[165px]'>
                            {allBids && allBids.map((bid, index) => (
                                <div className='flex justify-between items-center' key={index}>
                                    <div>
                                        <h3 
                                            className='mt-4 font-bold' 
                                            style={{ color: !index && 'var(--primary)' }}
                                        >
                                            {bid && inputCurrency(bid.bid_price.toString())} VNĐ
                                        </h3>
                                        <p className='text-[14px] text-[var(--second-text-color)]'>
                                            {bid && bid.bid_status}
                                        </p>
                                    </div>
                                    <div className='font-semibold'>
                                        {bid && inputPhone(bid.user_phone_number)}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className='flex items-center mt-4 mb-8 mx-auto px-8 py-2 w-fit border-[0px] border-[var(--primary)] rounded-[8px]'>
                            <span>Giá hiện tại:</span>
                            <span className='ml-4 text-[20px] font-bold'>
                                {(allBids && inputCurrency(allBids[0].bid_price.toString())) || '0'} VNĐ
                            </span>
                        </div>
                        <Input 
                            type='text' 
                            inline
                            label='Đặt giá'
                            placeholder='VD: 100,000,000'
                            name='email'
                            value={inputCurrency(bid)}
                            onChange={(e) => setBid(e.target.value)}
                        />
                        <Button className='p-[9px_16px] w-full' primary onClick={handleSubmit}>Đặt giá</Button>
                    </div>
                </div>

                {showModal && 
                    <Modal className='w-2/5'>
                        <BidResult 
                            item={item}
                            win={win}
                            winning_bid={allBids && inputCurrency(allBids[0].bid_price.toString())}
                            onClose={handleCloseModal}
                        />
                    </Modal>
                }
            </div>
        </div>
    );
}

export default Room;