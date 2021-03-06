import * as React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';

import { Omit, BreakpointResponseResult } from '../../types';
import { styled, Theme } from '../../styles';

import { HttpExchange } from '../../model/http/exchange';
import { getStatusColor } from '../../model/http/exchange-colors';

import { CollapsibleCardHeading } from '../common/card';
import {
    ExchangeCard,
    ExchangeCardProps,
} from './exchange-card';
import { Pill } from '../common/pill';
import { ContentLabelBlock, ContentLabel } from '../common/text-content';
import {
    headersToHeadersArray,
    headersArrayToHeaders,
    HeadersArray,
    EditableHeaders
} from '../common/editable-headers';
import { EditableStatus } from '../common/editable-status';

interface ResponseBreakpointCardProps extends Omit<ExchangeCardProps, 'children'> {
    theme: Theme;
    exchange: HttpExchange;
    onChange: (response: Partial<BreakpointResponseResult>) => void;
}

const StatusContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: baseline;
`;

const InlineEditableStatus = styled(EditableStatus)`
    margin-left: 10px;
    margin-bottom: 5px;
    flex-basis: 100%;
`;

@observer
export class ExchangeBreakpointResponseCard extends React.Component<ResponseBreakpointCardProps> {

    render() {
        const { exchange, onChange, theme, ...cardProps } = this.props;

        const { inProgressResult } = exchange.responseBreakpoint!;
        const headers = headersToHeadersArray(inProgressResult.headers!);
        const { statusCode, statusMessage } = inProgressResult;

        return <ExchangeCard {...cardProps} direction='left'>
            <header>
                <Pill color={getStatusColor(inProgressResult.statusCode, theme!)}>{ statusCode }</Pill>
                <CollapsibleCardHeading onCollapseToggled={cardProps.onCollapseToggled}>
                    Response
                </CollapsibleCardHeading>
            </header>

            <StatusContainer>
                <ContentLabel>Status:</ContentLabel>
                <InlineEditableStatus
                    statusCode={statusCode}
                    statusMessage= {statusMessage}
                    onChange={this.onStatusChange}
                />
            </StatusContainer>

            <ContentLabelBlock>Headers</ContentLabelBlock>
            <EditableHeaders
                headers={headers}
                onChange={this.onHeadersChanged}
            />
        </ExchangeCard>;
    }

    @action.bound
    onHeadersChanged(headers: HeadersArray) {
        this.props.onChange({ headers: headersArrayToHeaders(headers) });
    }

    @action.bound
    onStatusChange(statusCode: number | '', statusMessage: string | undefined) {
        this.props.onChange({ statusCode: statusCode || NaN, statusMessage });
    }

}