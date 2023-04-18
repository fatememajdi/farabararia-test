import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { SearchOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import { Button, Input, Space, Table } from 'antd';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import {
    useNavigate
} from 'react-router-dom';

//--------------------------------------------style
import './cryptos.css';

//--------------------------------------------url
import { baseUrl } from '../../config/service';

//-----------------------------------------------types
export type Crypto = {
    name: string;
    symbol: string;
    current_price: string;
    id: string;
}

const Cryptos = () => {
    const [cryptos, setCryptos] = useState<Crypto[] | null>();

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const navigate = useNavigate();
    type DataIndex = keyof Crypto;

    const handleSearch = (
        selectedKeys: string[],
        confirm: (param?: FilterConfirmProps) => void,
        dataIndex: DataIndex,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<Crypto> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText((selectedKeys as string[])[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const columns: ColumnsType<Crypto> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '30%',
            ...getColumnSearchProps('name')
        },
        {
            title: 'Symbol',
            dataIndex: 'symbol',
            key: 'age',
            width: '30%',
            ...getColumnSearchProps('symbol')
        },
        {
            title: 'Current Price',
            dataIndex: 'current_price',
            key: 'current_price'
        }
    ]

    useEffect(() => {
        GetCryptos();
    }, [])

    const GetCryptos = async () => {
        await axios.get(baseUrl + `markets?vs_currency=usd`).then((response) => {
            setCryptos(response.data);
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        });
    }

    return (
        <div className='col-12 coins-page'>

            {/* ------------------------------------------------------------title */}
            <div className='col-md-10 col-lg-10 col-12 coins-page-title'>Cryptocurrencies</div>

            {
                cryptos ?
                    < div className='col-md-10 col-lg-10 col-12 coins-list-container'>
                        <Table
                            onRow={(record, rowIndex) => {
                                return {
                                    onClick: event => { navigate(`/cryptos/:${rowIndex}`, { state: { id: record.id } }); }
                                };
                            }}
                            columns={columns} dataSource={cryptos} />
                    </div>
                    : <div>
                        loading...
                    </div>
            }
        </div >
    );
}

export default Cryptos;