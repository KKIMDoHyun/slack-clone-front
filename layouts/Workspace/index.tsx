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
    WorkspaceModal,
    WorkspaceName,
    Workspaces,
    WorkspaceWrapper,
} from '@layouts/Workspace/styles';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { useCallback, useState, VFC } from 'react';
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
import { toast } from 'react-toastify';
import CreateChannelModal from '@components/CreateChannelModal';

const Workspace: VFC = () => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
    const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
    const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
    const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');
    const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);

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
    const onCreateWorkspace = useCallback(
        (e) => {
            e.preventDefault();
            if (!newWorkspace || !newWorkspace.trim()) return;
            if (!newUrl || !newUrl.trim()) return;
            axios
                .post(
                    '/api/workspaces',
                    {
                        workspace: newWorkspace,
                        url: newUrl,
                    },
                    {
                        withCredentials: true,
                    },
                )
                .then(() => {
                    revalidate();
                    setShowCreateWorkspaceModal(false);
                    setNewWorkspace('');
                    setNewUrl('');
                })
                .catch((err) => {
                    console.dir(err);
                    toast.error(err.response?.data, { position: 'bottom-center' });
                });
        },
        [newWorkspace, newUrl],
    );
    const onCloseModal = useCallback(() => {
        setShowCreateWorkspaceModal(false);
        setShowCreateChannelModal(false);
    }, []);

    const toggleWorkspaceModal = useCallback(() => {
        setShowWorkspaceModal((prev) => !prev);
    }, []);

    const onClickAddChannel = useCallback(() => {
        setShowCreateChannelModal(true);
    }, []);

    // const onClickInviteWorkspace = useCallback(() => {
    //     setShowInviteWorkspaceModal(true);
    // }, []);

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
            <WorkspaceWrapper>
                <Workspaces>
                    {userData?.Workspaces.map((ws: IWorkspace) => {
                        return (
                            <Link key={ws.id} to={`/workspace/${123}/channel/??????`}>
                                <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
                            </Link>
                        );
                    })}
                    <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
                </Workspaces>
                <Channels>
                    <WorkspaceName onClick={toggleWorkspaceModal}>SLACK</WorkspaceName>
                    <MenuScroll>
                        <Menu
                            show={showWorkspaceModal}
                            onCloseModal={toggleWorkspaceModal}
                            style={{ top: 95, left: 80 }}
                        >
                            <WorkspaceModal>
                                <h2>Sleact</h2>
                                {/* <button onClick={onClickInviteWorkspace}>????????????????????? ????????? ??????</button> */}
                                <button onClick={onClickAddChannel}>?????? ?????????</button>
                                <button onClick={onLogout}>????????????</button>
                            </WorkspaceModal>
                        </Menu>
                    </MenuScroll>
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
                            <span>?????????????????? ??????</span>
                            <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
                        </Label>
                        <Label id="workspace-url-label">
                            <span>?????????????????? url</span>
                            <Input id="workspace" value={newUrl} onChange={onChangeNewUrl} />
                        </Label>
                        <Button type="submit">????????????</Button>
                    </form>
                </Modal>
                <CreateChannelModal
                    show={showCreateChannelModal}
                    onCloseModal={onCloseModal}
                    setShowCreateChannelModal={setShowCreateChannelModal}
                />
            </WorkspaceWrapper>
        </div>
    );
};

export default Workspace;
