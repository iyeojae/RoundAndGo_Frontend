import React from 'react';
import { TAB_LABELS } from '../Common/Community/Community_TAB_LABELS';

const CategorySelector = ({ selectedCategory, setSelectedCategory, error }) => (
    <div id='section-cont'>
        <label>카테고리</label>
        <div className={`category-select ${error ? 'error' : ''}`}>
            {TAB_LABELS.filter(tab => tab.key !== 'LATEST').map(tab => (
                <button
                    key={tab.key}
                    type="button"
                    className={selectedCategory === tab.key ? 'active' : ''}
                    onClick={() => setSelectedCategory(tab.key)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    </div>
);

export default CategorySelector;
