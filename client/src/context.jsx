import {createContext} from 'react';
import { formatNumberWithSpaces } from './utils';
import PropTypes from 'prop-types';

export const UtilsContext = createContext("without provider");

export const UtilsProvider = ({children}) => {
    const utils = {
        formatNumberWithSpaces
    };

    return (<UtilsContext.Provider value={utils}>
        {children}
    </UtilsContext.Provider>);
};

UtilsProvider.propTypes = {
    children: PropTypes.any
}