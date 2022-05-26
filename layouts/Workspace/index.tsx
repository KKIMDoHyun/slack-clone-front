import {
    AddButton,
    Channels,
    Chats,
    Header,
    MenuScroll,
    ProfileImg,
    ProfileModal,
    RightMenu,
    WorkspaceButton,
    WorkspaceName,
    Workspaces,
    WorkspaceWrapper,
} from '@layouts/Workspace/styles';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router';
import useSWR from 'swr';
import gravatar from 'gravatar';
import Menu from '@components/Menu';
import DirectMessage from '@pages/DirectMessage';
import Channel from '@pages/Channel';
import { Link } from 'react-router-dom';
import { IUser, IWorkspace } from '@typings/db';
import { Button, Input, Label } from '@pages/SignUp/styles';
import useInput from '@hooks/useInput';
import Modal from '@components/Modal';

const Workspace: FC = ({ children }) => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
    const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
    const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');

    const {
        data: userData,
        error,
        revalidate,
        mutate,
    } = useSWR<IUser | false>('/api/users', fetcher, {
        dedupingInterval: 2000,
    });

    const onLogout = useCallback(() => {
        axios
            .post('/api/users/logout', null, {
                withCredentials: true,
            })
            .then(() => {
                // revalidate();
                mutate(false, false);
            });
    }, []);
    const onClickUserProfile = useCallback((e) => {
        e.stopPropagation();
        setShowUserMenu((prev) => !prev);
    }, []);
    const onClickCreateWorkspace = useCallback(() => {
        setShowCreateWorkspaceModal(true);
    }, []);
    const onCreateWorkspace = useCallback(() => {}, []);
    const onCloseModal = useCallback(() => {
        setShowCreateWorkspaceModal(false);
    }, []);
    if (!userData) {
        return <Redirect to="/login" />;
    }
    return (
        <div>
            <Header>
                <RightMenu>
                    <span onClick={onClickUserProfile}>
                        <ProfileImg
                            src={gravatar.url(userData.nickname, { s: '28px', d: 'retro' })}
                            alt={userData.nickname}
                        />
                        {showUserMenu && (
                            <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onClickUserProfile}>
                                <ProfileModal>
                                    <img
                                        src={gravatar.url(userData.nickname, { s: '36px', d: 'retro' })}
                                        alt={userData.nickname}
                                    />
                                    <div>
                                        <span id="profile-name">{userData.nickname}</span>
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
                <Workspaces>
                    {userData?.Workspaces.map((ws: IWorkspace) => {
                        return (
                            <Link key={ws.id} to={`/workspace/${123}/channel/일반`}>
                                <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
                            </Link>
                        );
                    })}
                    <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
                </Workspaces>
                <Channels>
                    <WorkspaceName>SLACK</WorkspaceName>
                    <MenuScroll>menu scroll</MenuScroll>
                </Channels>
                <Chats>
                    <Switch>
                        {/* <Route path="/workspace/channel" component={Channel} />
                        <Route path="/workspace/dm" component={DirectMessage} /> */}
                    </Switch>
                </Chats>
                <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
                    <form onSubmit={onCreateWorkspace}>
                        <Label id="workspace-label">
                            <span>워크스페이스 이름</span>
                            <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
                        </Label>
                        <Label id="workspace-url-label">
                            <span>워크스페이스 url</span>
                            <Input id="workspace" value={newUrl} onChange={onChangeNewUrl} />
                        </Label>
                        <Button type="submit">생성하기</Button>
                    </form>
                </Modal>
            </WorkspaceWrapper>
        </div>
    );
};

export default Workspace;
