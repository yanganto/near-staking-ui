import TreeView from "@mui/lab/TreeView";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import {Box, Chip} from "@mui/material";
import * as React from "react";
import {styled} from "@mui/material/styles";
import TreeItem, {treeItemClasses} from "@mui/lab/TreeItem";
import Typography from "@mui/material/Typography";
import {Link} from 'react-router-dom';


const MainMenu = () => {
	const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
		color: theme.palette.text.secondary,
		[`& .${ treeItemClasses.content }`]: {
			fontSize: '24px',
			backgroundColor:  theme.palette.mode === 'dark' ? '#151C2B' : '#FEFEFF',
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
					'0px 2.52704px 5.32008px rgba(54, 223, 211, 0.10064), 0px 1.05156px 2.21381px rgba(54, 223, 211, 0.14)':
					'0px 38px 80px rgba(128, 47, 243, 0.0393604), 0px 15.8755px 33.4221px rgba(128, 47, 243, 0.056545), ' +
					'0px 8.4878px 17.869px rgba(128, 47, 243, 0.07), 0px 4.75819px 10.0172px rgba(128, 47, 243, 0.083455), ' +
					'0px 2.52704px 5.32008px rgba(128, 47, 243, 0.10064), 0px 1.05156px 2.21381px rgba(128, 47, 243, 0.14)',
			},
			'&:hover': {
				backgroundColor:  theme.palette.mode === 'dark' ? '#151C2B' : '#FEFEFF',
				border: theme.palette.mode === 'dark' ? '1px solid #36DFD3' : '1px solid #802FF3',
				color: theme.palette.mode === 'dark' ? '#FEFEFF' : '#002147',
			},
			'&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
				backgroundColor:  theme.palette.mode === 'dark' ? '#151C2B' : '#FEFEFF',
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
				sx={ { paddingTop: '60px', paddingLeft: '20px' } }
				aria-label="protocol"
				//selected={ '11' }
				//defaultExpanded={ ['1'] }
				defaultCollapseIcon={ <ArrowDropDownIcon sx={ { marginLeft: '450px' } }/> }
				defaultExpandIcon={ <ArrowLeftIcon sx={ { marginLeft: '450px' } }/> }
				defaultEndIcon={ <div style={ { width: 24 } }/> }
			>

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