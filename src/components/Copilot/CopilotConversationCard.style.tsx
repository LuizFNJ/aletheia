import { Row } from "antd";
import colors from "../../styles/colors";
import styled from "styled-components";

const CopilotConversationCardStyle = styled(Row)`
    display: flex;
    flex-direction: column;

    .conversation-card-header {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .conversation-card-content {
        position: relative;
        margin: 12px 0 16px 0;
        padding: 16px;
        border-radius: 10px;
        background-color: ${colors.white};
        marginleft: 40px;
        wordbreak: break-word;
        &:after {
            border: 1px solid red;
            width: 10px;
            height: 10px;
            content: " ";
            position: absolute;
            border-top: none;
            border-right: 9px solid transparent;
            border-left: 9px solid transparent;
            border-bottom: 9px solid ${colors.white};
            left: 8px;
            top: -8px;
            transform: rotate(0deg);
        }
    }
`;

export default CopilotConversationCardStyle;
