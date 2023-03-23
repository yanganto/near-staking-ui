import TreeView from "@mui/lab/TreeView";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import {Box, Chip, IconButton, Tooltip} from "@mui/material";
import * as React from "react";
import {styled, useTheme} from "@mui/material/styles";
import TreeItem, {treeItemClasses} from "@mui/lab/TreeItem";
import Typography from "@mui/material/Typography";
import {Link} from 'react-router-dom';
import {MyButton} from "./NavBar";


export const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
	color: theme.palette.text.secondary,
	[`& .${ treeItemClasses.content }`]: {
		fontSize: '24px',
		backgroundColor: theme.palette.mode === 'dark' ? '#151C2B' : '#FEFEFF',
		border: '1px solid #D2D1DA',
		height: '72px',
		width: '264px',
		color: theme.palette.mode === 'dark' ? '#FEFEFF' : '#002147',
		borderRadius: '15px',
		fontWeight: '400',
		'&.Mui-expanded': {
			backgroundColor: theme.palette.mode === 'dark' ? '#36DFD3' : '#802FF3',
			border: theme.palette.mode === 'dark' ? '1px solid #36DFD3' : '1px solid #802FF3',
			color: theme.palette.mode === 'dark' ? '#002147' : '#FEFEFF',
			boxShadow: theme.palette.mode === 'dark' ?
				'0px 38px 80px rgba(54, 223, 211, 0.0393604), 0px 15.8755px 33.4221px rgba(54, 223, 211, 0.056545), ' +
				'0px 8.4878px 17.869px rgba(54, 223, 211, 0.07), 0px 4.75819px 10.0172px rgba(54, 223, 211, 0.083455), ' +
				'0px 2.52704px 5.32008px rgba(54, 223, 211, 0.10064), 0px 1.05156px 2.21381px rgba(54, 223, 211, 0.14)' :
				'0px 38px 80px rgba(128, 47, 243, 0.0393604), 0px 15.8755px 33.4221px rgba(128, 47, 243, 0.056545), ' +
				'0px 8.4878px 17.869px rgba(128, 47, 243, 0.07), 0px 4.75819px 10.0172px rgba(128, 47, 243, 0.083455), ' +
				'0px 2.52704px 5.32008px rgba(128, 47, 243, 0.10064), 0px 1.05156px 2.21381px rgba(128, 47, 243, 0.14)',
		},
		'&:hover': {
			backgroundColor: theme.palette.mode === 'dark' ? '#151C2B' : '#FEFEFF',
			border: theme.palette.mode === 'dark' ? '1px solid #36DFD3' : '1px solid #802FF3',
			color: theme.palette.mode === 'dark' ? '#FEFEFF' : '#002147',
		},
		'&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
			backgroundColor: theme.palette.mode === 'dark' ? '#151C2B' : '#FEFEFF',
			border: theme.palette.mode === 'dark' ? '1px solid #36DFD3' : '1px solid #802FF3',
			color: theme.palette.mode === 'dark' ? '#FEFEFF' : '#002147',
		},
		[`& .${ treeItemClasses.label }`]: {
			fontSize: '24px',
			fontWeight: 'inherit',
			color: 'inherit',
		},
	},
	[`& .${ treeItemClasses.group }`]: {
		[`& .${ treeItemClasses.content }`]: {
			width: '238px',
		},
	},
}));

const MainMenu = ({ changeTheme, wallet }) => {
	const theme = useTheme();

	function StyledTreeItem(props) {
		const {
			labelIcon: LabelIcon,
			labelText,
			to,
			disabled,
			...other
		} = props;

		return (
			<StyledTreeItemRoot sx={ { margin: 1 } } disabled={ disabled }
			                    label={
				                    <Box sx={ { display: 'flex', alignItems: 'center' } } to={ to } component={ Link }
				                         style={ { textDecoration: 'none', color: 'inherit' } }>
					                    {/*<Box component={ LabelIcon } color="inherit" sx={ { mr: 1 } }/>*/ }
					                    <Typography variant="body2"
					                                sx={ { fontWeight: 'inherit', fontSize: 'inherit', flexGrow: 1 } }>
						                    { labelText }
					                    </Typography>
				                    </Box>
			                    }
			                    { ...other }
			/>
		);
	}

	return (
		<>
			<TreeView
				sx={ { paddingTop: '50px', paddingLeft: '20px' } }
				aria-label="protocol"
				//selected={ '11' }
				//defaultExpanded={ ['1'] }
				defaultCollapseIcon={ <ArrowDropDownIcon sx={ { marginLeft: '450px' } }/> }
				defaultExpandIcon={ <ArrowLeftIcon sx={ { marginLeft: '450px' } }/> }
				defaultEndIcon={ <div style={ { width: 24 } }/> }
			>
				<Typography
					variant="h6"
					component="div"
					sx={ { flexGrow: 1, display: { xs: 'block', sm: 'none' }, paddingBottom: '5px' } }
				>
					<Box display="flex" alignItems="center">
						<IconButton sx={ { ml: 1 } } onClick={ changeTheme } color="inherit">
							{ theme.palette.mode === 'dark' ? <img src="/icons/ic-sun.png" alt="dark mode"/> :
								<img src="/icons/ic-circular.png" alt="light mode"/> }
						</IconButton>
						<IconButton sx={ { ml: 1 } } color="inherit">
							<img src={ "/icons/ic-notifications-" + theme.palette.mode + ".png" } alt="notifications"/>
						</IconButton>
						<Tooltip title="Click to Copy to Clipboard">
							<MyButton
								onClick={ () => {
									navigator.clipboard.writeText(wallet.accountId)
								} }>
								{ wallet.accountId.length > 16 ?
									wallet.accountId.substring(0, 8) + '...' + wallet.accountId.substring(wallet.accountId.length - 8)
									: wallet.accountId
								}
							</MyButton>
						</Tooltip>
					</Box>
				</Typography>

				<Box pl={ 1 } pr={ 1 }>
					<Chip sx={ { width: 264, height: 32, fontSize: '16px' } } label="PROTOCOL"/>
				</Box>

				<StyledTreeItem nodeId="1" labelText="Staking">
					<StyledTreeItem nodeId="11" labelText="Delegate" to="/stake"/>
					<StyledTreeItem nodeId="12" labelText="Reporting" to="/rewards"/>
				</StyledTreeItem>
				<StyledTreeItem nodeId="2" labelText="Validators" to="/pools"/>

				<Box pl={ 1 } pr={ 1 } pt={ 2 }>
					<Chip sx={ { width: 264, height: 32, fontSize: '16px' } } label="INFRASTRUCTURE"/>
				</Box>

				<StyledTreeItem nodeId="3" labelText="Servers" disabled/>
				<StyledTreeItem nodeId="4" labelText="Keys" disabled/>

			</TreeView>
		</>
	)
		;
}


export default MainMenu;