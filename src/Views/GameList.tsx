import React, {useEffect, useState} from 'react';
import axios from 'axios';
import GameFilter from '../Components/GameFilter';
import '../Styles/GameList.css'
import {Game, Provider, Group, Options, FiltersParams} from '../Types/types';
import Select from "react-select";

interface GameListProps {
    username: string;
    onLogout: () => void;
}

const GameList: React.FC<GameListProps> = ({username, onLogout}) => {
    // 检测是否进入移动端，用于一些媒体查询无法满足的样式变化(因为登录页没有需要监听的元素所以放在这儿,实际项目中可以用库检测当前设备平台)
    const [isMobile, setIsMobile] = useState<boolean>(false);
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 600);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);
    // 游戏数据
    const [filteredGames, setFilteredGames] = useState<Game[]>([]);
    // 供应商数据
    const [providers, setProviders] = useState<Provider[]>([]);
    // 游戏类别数据
    const [groups, setGroups] = useState<Group[]>([]);
    // 列数选项
    const columnsOptions: Options[] = [
        {value: 1, label: '1'},
        {value: 2, label: '2'},
        {value: 3, label: '3'},
        {value: 4, label: '4'},
        {value: 5, label: '5'},
        {value: 6, label: '6'},
    ]
    // 列数
    const [columns, setColumns] = useState<Options | undefined>(columnsOptions[5]);
    const dynamicStyle = isMobile
        ? {}
        : {
            gridTemplateColumns: `repeat(${columns?.value}, 1fr)`, // 动态设置列数
        };
    // 页面数据请求
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [gamesResponse, providersResponse, groupsResponse] = await Promise.all([
                    axios.post('http://localhost:5000/games'),
                    axios.get('http://localhost:5000/providers'),
                    axios.get('http://localhost:5000/groups'),
                ]);
                setFilteredGames(gamesResponse.data);
                setProviders(providersResponse.data);
                setGroups(groupsResponse.data);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };

        fetchData();
    }, []);

    // 处理过滤
    const handleFilter = async (filters: FiltersParams) => {
        try {
            const response = await axios.post(`http://localhost:5000/games`, filters);
            setFilteredGames(response.data);
        } catch (error) {
            console.error('Failed to fetch filtered games:', error);
        }
    };

    return (
        <>
            <header className='page-header'>
                <div className='page-header-title'>Player Games</div>
                <div>
                    <div className='columns-select-container'>
                        <span>columns:</span>
                        <Select
                            value={columns}
                            options={columnsOptions}
                            onChange={(selected) => {
                                setColumns(selected || undefined)
                            }}
                            placeholder="Select Column"
                            className='columns-select'
                        />
                    </div>
                    <span>{username}</span>
                    <span className='logout-button' onClick={onLogout}>logout</span>
                </div>
            </header>
            <GameFilter
                providers={providers}
                groups={groups}
                onFilter={handleFilter}
                isMobile={isMobile}
            />
            <div className="list-container" style={dynamicStyle}>
                {filteredGames.map((game) => (
                    <div key={game.id} className='list-container-items'>
                        <img src={game.cover} alt={game.name} style={{width: '100%'}}/>
                        <div className='list-container-items-name'>{game.name}</div>
                        <div>{providers.find((p) => p.id === game.provider)?.name}</div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default GameList;
