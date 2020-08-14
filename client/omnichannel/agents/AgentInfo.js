import React from 'react';
import { Box, Margins, Button, Icon, ButtonGroup } from '@rocket.chat/fuselage';

import { useTranslation } from '../../contexts/TranslationContext';
import VerticalBar from '../../components/basic/VerticalBar';
import { useEndpointDataExperimental, ENDPOINT_STATES } from '../../hooks/useEndpointDataExperimental';
import { UserInfo } from '../../components/basic/UserInfo';
import * as UserStatus from '../../components/basic/UserStatus';
import { FormSkeleton } from './Skeleton';

export const AgentInfo = React.memo(function AgentInfo({
	uid,
	children,
	...props
}) {
	const t = useTranslation();
	const { data, state, error } = useEndpointDataExperimental(`livechat/users/agent/${ uid }`);

	if (state === ENDPOINT_STATES.LOADING) {
		return <FormSkeleton/>;
	}

	if (error) {
		return <Box mbs='x16'>{t('User_not_found')}</Box>;
	}

	const { user } = data || { user: {} };
	const {
		username,
		statusLivechat,
	} = user;

	const status = UserStatus.getStatus(data.status);

	return <VerticalBar.ScrollableContent p='x24' {...props}>

		<UserInfo.Avatar size={'x332'} username={username}/>

		<ButtonGroup mi='neg-x4' flexShrink={0} flexWrap='nowrap' withTruncatedText justifyContent='center' flexShrink={0}>
			{children}
		</ButtonGroup>

		<Margins block='x4'>
			<UserInfo.Username name={username} status={status} />

			{statusLivechat && <>
				<UserInfo.Label>{t('Livechat_Status')}</UserInfo.Label>
				<UserInfo.Info>{t(statusLivechat)}</UserInfo.Info>
			</>}
		</Margins>

	</VerticalBar.ScrollableContent>;
});

export const Action = ({ icon, label, ...props }) => (
	<Button title={label} {...props} mi='x4'>
		<Icon name={icon} size='x20' mie='x4' />
		{label}
	</Button>
);

AgentInfo.Action = Action;

export default AgentInfo;