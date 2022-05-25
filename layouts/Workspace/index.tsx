import {
    Channels,
    Chats,
    Header,
    MenuScroll,
    ProfileImg,
    ProfileModal,
    RightMenu,
    WorkspaceName,
    Workspaces,
    WorkspaceWrapper,
} from '@layouts/Workspace/styles';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback, useState } from 'react';
import { Redirect, Route } from 'react-router';
import useSWR from 'swr';
import gravatar from 'gravatar';
import Menu from '@components/Menu';
import DirectMessage from '@pages/DirectMessage';
import Channel from '@pages/Channel';

const Workspace: FC = ({ children }) => {
    const [showUserMenu, setShowUserMenu] = useState(false);
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
    const onClickUserProfile = useCallback(() => {
        setShowUserMenu((prev) => !prev);
    }, []);
    if (!data) {
        return <Redirect to="/login" />;
    }
    return (
        <div>
            <Header>
                <RightMenu>
                    <span onClick={onClickUserProfile}>
                        <ProfileImg src={gravatar.url(data.nickname, { s: '28px', d: 'retro' })} alt={data.nickname} />
                        {showUserMenu && (
                            <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onClickUserProfile}>
                                <ProfileModal>
                                    <img
                                        src={gravatar.url(data.nickname, { s: '36px', d: 'retro' })}
                                        alt={data.nickname}
                                    />
                                    <div>
                                        <span id="profile-name">{data.nickname}</span>
                                        <span id="profile-active">Active</span>
                                    </div>
                                </ProfileModal>
                            </Menu>
                        )}
                    </span>
                </RightMenu>
            </Header>
            <button onClick={onLogout}>로그아웃</button>
            <WorkspaceWrapper>
                <Workspaces>test</Workspaces>
                <Channels>
                    <WorkspaceName>SLACK</WorkspaceName>
                    <MenuScroll>menu scroll</MenuScroll>
                </Channels>
                <Chats>
                    {/* <Route path="/workspace/channel" component={Channel} />
                    <Route path="/workspace/dm" component={DirectMessage} /> */}
                </Chats>
            </WorkspaceWrapper>
        </div>
    );
};

export default Workspace;
