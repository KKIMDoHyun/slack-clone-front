import { Header } from '@layouts/Workspace/styles';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback } from 'react';
import { Redirect } from 'react-router';
import useSWR from 'swr';

const Workspace: FC = ({ children }) => {
    const { data, error, revalidate, mutate } = useSWR('/api/users', fetcher);

    const onLogout = useCallback(() => {
        axios
            .post('http://localhost:3095/api/users/logout', null, {
                withCredentials: true,
            })
            .then((res) => {
                // revalidate();
                mutate(res.data, false);
            });
    }, []);

    if (!data) {
        return <Redirect to="/login" />;
    }
    return (
        <div>
            <Header>test</Header>
            <button onClick={onLogout}>로그아웃</button>
            {children}
        </div>
    );
};

export default Workspace;
