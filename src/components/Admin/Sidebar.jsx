import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import TreeView from '@mui/lab/TreeView'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';

const SidebarItems = [
    {
        heading: "Dashboard", link: "/admin/dashboard"
    },
    {
        heading: "Products", subHeading1: 'All Products', subHeading1Link: "/admin/products", 
        subHeading2: "Create Product", subHeading2Link: "/admin/product/create",
    },
    {
        heading: "Orders", link: "/admin/orders"
    },
    {
        heading: "Users", link: "/admin/users"
    },
    {
        heading: "Reviews", link: "/admin/reviews"
    },
]

function Sidebar() {
    const location = useLocation();
    function matchRoute(route) {
        const actaulRoute = route.split("/");
        const lastRoute = actaulRoute[actaulRoute.length - 1];

        const pathArray = location.pathname.split("/");
        const lastPath = pathArray[pathArray.length - 1];
        return lastRoute === lastPath;
    }

    return (
        <div className='bg-blue-900  text-center min-[1080px]:text-start text-white h-full w-[222px]'>
            <div className='flex flex-col'>
                {
                    SidebarItems.map((ele, index) => (
                        ele.heading === "Products" ? 
                        <div key={index} className='py-2 px-5 min-[1080px]:px-0 min-[1080px]:place-self-start place-self-center'>
                            <TreeView aria-label="file system navigator" defaultCollapseIcon={<ExpandMoreIcon />} defaultExpandIcon={<ChevronRightIcon />}>

                                <TreeItem nodeId="1" label={<div className='font-bold text-lg'>Products</div>}>
                                    <div className='flex flex-col '>
                                        <Link to={ele.subHeading1Link}>
                                            <TreeItem nodeId="2" label={<div className={`font-bold text-sm ${matchRoute(ele.subHeading1Link) ? 'text-yellow-400' : 'text-white'}`}>{ele.subHeading1}</div>} />
                                        </Link>
                                        <Link to={ele.subHeading2Link}>
                                            <TreeItem nodeId="3" label={<div className={`font-bold text-sm ${matchRoute(ele.subHeading2Link) ? 'text-yellow-400' : 'text-white'}`}>{ele.subHeading2}</div>} />
                                        </Link>
                                    </div>
                                </TreeItem>

                            </TreeView>
                        </div> :
                        <div key={index} className={`px-5 py-2 text-lg font-bold ${matchRoute(ele.link) ? 'text-yellow-400' : 'text-white'}`}>
                            <Link to={ele.link}>{ele.heading}</Link>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Sidebar