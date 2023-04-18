/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import axios from 'axios';
import { Select } from 'antd';

//---------------------------------------style
import './cryptoDetails.css'

//--------------------------------------------url
import { baseUrl } from '../../config/service';

//-----------------------------------------world currency symbols
const Currency = [
    {
        value: 'usd',
        label: 'United States Dollar $  ',
    },
    {
        value: 'eur',
        label: 'Euro Member Countries €  ',
    }
]

//-----------------------------------------------types
export type Currensies = {
    eur: string;
    usd: string;
};

export type MarketData = {
    price_change_24h: string;
    current_price: Currensies;
    fully_diluted_valuation: Currensies;
    market_cap: Currensies;
}

export type Image = {
    small: string;
}

export type Crypto = {
    name: string;
    symbol: string;
    current_price: string;
    id: string;
    market_cap_rank: string;
    market_data: MarketData;
    image: Image;
}

const CryptoDetails = () => {

    const location = useLocation();
    const [crypto, setCrypto] = useState<Crypto | null>();
    const [selectedCurrency, changeSelectedCurrency] = useState<string | null>();

    //--------------------------------------handle currency select change
    const handleSelectChange = async (value: string) => {
        await changeSelectedCurrency(value);
    };

    const GetCryptoDetails = async () => {
        await axios.get(baseUrl + `${location.state.id}?&market_data=true`).then((response) => {
            setCrypto(response.data);
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        GetCryptoDetails();
    }, []);

    return (
        <div className='col-12 coins-details-page'>
            {
                crypto ?
                    <div className='col-md-10 col-lg-10 col-12 coins-details-card'>
                        <div className='col-12 coins-details-title'>
                            {/* -------------------------------------------------------------title */}
                            <img src={crypto.image.small} alt='cryptocurrency_image' />
                            <h1>{crypto.name}</h1>
                            <div className='coins-details-info-card'>
                                {crypto.symbol}
                            </div>


                            {/* -------------------------------------------------------------currrency select */}
                            <Select
                                defaultValue="United States Dollar $  "
                                style={{ marginLeft: 'auto' }}
                                onChange={handleSelectChange}
                                options={Currency}
                            />

                        </div>

                        <div className='coins-details-info-card'>
                            <h5>
                                market cap rank
                            </h5>
                            <h4>
                                {'#' + crypto.market_cap_rank}
                            </h4>
                        </div>

                        <div className='col-12 coin-details-price-table'>
                            <CoinInfoCard title='Volume(24h)'
                                content={crypto.market_data.price_change_24h} />

                            <CoinInfoCard title='Price'
                                content={selectedCurrency === 'eur' ? crypto.market_data.current_price.eur : crypto.market_data.current_price.usd} />

                            <CoinInfoCard title='Fully Diluted Market Cap'
                                content={selectedCurrency === 'eur'
                                    ? crypto.market_data.fully_diluted_valuation.eur
                                    : crypto.market_data.fully_diluted_valuation.usd} />

                            <CoinInfoCard title='Market Cap'
                                content={selectedCurrency === 'eur' ? crypto.market_data.market_cap.eur
                                    : crypto.market_data.market_cap.usd
                                } />
                        </div>
                    </div>
                    : <div>
                        loading...
                    </div>
            }
        </div>
    );
}

export default CryptoDetails;

//-----------------------------------------------types
type coinInfoCardProps = {
    title: string;
    content: string;
};

const CoinInfoCard = ({ title, content }: coinInfoCardProps) => {
    return (
        <div className='col-lg-3 col-md-4 col-sm-6 col-12 coin-priceInfo-card'>
            <h2>
                {title}
            </h2>
            <h3>
                {content}
            </h3>
        </div>
    );
}