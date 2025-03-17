import React, {useState} from 'react';
import Select from 'react-select';
import {Provider, Group, Options, FiltersParams} from '../Types/types';
import '../Styles/GameFilter.css'

interface GameFilterProps {
    providers: Provider[],
    groups: Group[],
    onFilter: (filters: FiltersParams) => void,
    isMobile: boolean,
}

const menuPortalTarget = document.getElementsByTagName("body")[0];

const GameFilter: React.FC<GameFilterProps> = ({providers, groups, onFilter, isMobile}) => {
    // 模拟排序选项
    const sortOptions: Options<string>[] = [
        {value: 'name-asc', label: 'A-Z'},
        {value: 'name-desc', label: 'Z-A'},
        {value: 'date-desc', label: 'newest'},
    ]

    // 游戏名
    const [name, setName] = useState<string>('');
    // 游戏提供商
    const [selectedProviders, setSelectedProviders] = useState<Options[]>([]);
    // 游戏类别
    const [selectedGroup, setSelectedGroup] = useState<Options | null>();
    // 排序规则
    const [selectedSort, setSelectedSort] = useState<Options<string> | null>();

    const [selectedVisible, setSelectedVisible] = useState<boolean>(true);

    // 提供商选项
    const providerOptions = providers.map((provider) => ({
        value: provider.id,
        label: provider.name,
    }));
    // 游戏组选项
    const groupOptions = groups.map((group) => ({
        value: group.id,
        label: group.name,
    }));

    // 处理过滤
    const handleFilter = () => {
        onFilter({
            name,
            providerIds: selectedProviders?.map((item: Options) => item.value),
            groupId: selectedGroup?.value,
            sortBy: selectedSort?.value,
        });
    };
    // 重置所有选项
    const handleReset = () => {
        setSelectedProviders([])
        setSelectedGroup(null)
        setSelectedSort(null)
        setName('')
        onFilter({})
    }
    const selectCommonStyle = {
        menuPortal: (base: any) => ({ ...base, zIndex: 1000 }) // 确保下拉菜单在顶部
    }
    const desktopArea = () => (
        <>
            <input
                type="text"
                placeholder="Game name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='input-item input-custom'
            />
            <Select
                isMulti
                value={selectedProviders}
                options={providerOptions}
                menuPortalTarget={menuPortalTarget}
                styles={selectCommonStyle}
                onChange={(selected) =>
                    setSelectedProviders(selected as Options[] || [])
                }
                placeholder="Providers"
                className='input-item'
            />
            <Select
                value={selectedGroup}
                options={groupOptions}
                styles={selectCommonStyle}
                menuPortalTarget={menuPortalTarget}
                onChange={(selected) => setSelectedGroup(selected || null)}
                placeholder="Group"
                className='input-item'
                isClearable
            />
            <Select
                value={selectedSort}
                options={sortOptions}
                styles={selectCommonStyle}
                menuPortalTarget={menuPortalTarget}
                onChange={(selected) => setSelectedSort(selected || null)}
                placeholder="SortBy"
                className='input-item'
                isClearable
            />
        </>
    )
    return (
        <div
            className='filter-container'
            style={{
                height: isMobile ? selectedVisible ? 'auto' : '24px' : 'auto',
                padding: isMobile ? selectedVisible ? '24px' : '8px' : '24px',
            }}
        >
            {isMobile ?
                <>
                    <div
                        style={{display: isMobile ? selectedVisible ? 'none' : 'block' : 'none'}}
                        className='show-more'
                        onClick={() => setSelectedVisible(true)}>
                        show filters
                    </div>
                    {desktopArea()}
                </> : desktopArea()}
            <div style={{width: isMobile ? '100%' : 'auto'}}>
                <button className='submit-button' onClick={handleFilter}>Search</button>
                <button className='reset-button' onClick={handleReset}>Reset</button>
            </div>
            <div
                style={{display: isMobile ? selectedVisible ? 'block' : 'none' : 'none'}}
                className='show-more hide'
                onClick={() => setSelectedVisible(false)}>
                hide filters
            </div>
        </div>
    );
};

export default GameFilter;
