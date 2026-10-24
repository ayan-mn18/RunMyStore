import React from 'react';
import {renderToString} from 'react-dom/server';
import {MemoryRouter,Routes,Route} from 'react-router-dom';
import assert from 'node:assert/strict';
import {Provider} from '../src/store';
import {seed} from '../src/domain';
import Overview from '../src/pages/Overview';
import Catalog,{ProductEditor} from '../src/pages/Catalog';
import Website from '../src/pages/Website';
import Ads,{CreativeEditor} from '../src/pages/Ads';
import Campaigns,{CampaignDetail} from '../src/pages/Campaigns';
import Budgets from '../src/pages/Budgets';
import Agents,{Approvals} from '../src/pages/Agents';
import {Orders,OrderDetail,Inbox,Discoverability} from '../src/pages/Operations';
import Settings from '../src/pages/Settings';
import Storefront from '../src/pages/Storefront';
import Onboarding from '../src/pages/Onboarding';
import Legal from '../src/pages/Legal';
Object.defineProperty(globalThis,'localStorage',{value:{getItem:()=>JSON.stringify(seed()),setItem:()=>{}}});
const pages:[string,string,React.ReactElement][]=[
 ['/app/overview','/app/overview',<Overview ask={()=>{}}/>],['/app/catalog','/app/catalog',<Catalog/>],['/app/catalog/p1','/app/catalog/:id',<ProductEditor/>],['/app/website','/app/website',<Website/>],['/app/ads','/app/ads',<Ads/>],['/app/ads/ad1','/app/ads/:id',<CreativeEditor/>],['/app/campaigns','/app/campaigns',<Campaigns/>],['/app/campaigns/c1','/app/campaigns/:id',<CampaignDetail/>],['/app/budgets','/app/budgets',<Budgets/>],['/app/agents','/app/agents',<Agents/>],['/app/approvals','/app/approvals',<Approvals/>],['/app/orders','/app/orders',<Orders/>],['/app/orders/NW-1041','/app/orders/:id',<OrderDetail/>],['/app/inbox','/app/inbox',<Inbox/>],['/app/discoverability','/app/discoverability',<Discoverability/>],['/app/settings','/app/settings',<Settings/>],['/store/northwind','/store/:slug',<Storefront/>],['/onboarding','/onboarding',<Onboarding/>],['/legal/privacy','/legal/:page',<Legal/>],['/app/catalog/missing','/app/catalog/:id',<ProductEditor/>],['/app/ads/missing','/app/ads/:id',<CreativeEditor/>],['/app/campaigns/missing','/app/campaigns/:id',<CampaignDetail/>],['/app/orders/missing','/app/orders/:id',<OrderDetail/>],['/store/missing','/store/:slug',<Storefront/>]
];
for(const [url,path,element] of pages){const html=renderToString(<MemoryRouter initialEntries={[url]}><Provider><Routes><Route path={path} element={element}/></Routes></Provider></MemoryRouter>);assert.ok(html.length>100,`${url} produced an empty page`);assert.ok(!html.includes('NaN'),`${url} contains NaN`);console.log('Rendered:',url);}
console.log(`${pages.length} routes rendered without runtime exceptions. This is not browser or visual verification.`);
