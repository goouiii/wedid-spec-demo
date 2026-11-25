import type { ScreenId } from '../demo/state'
import { MainIntro, MainMember, MainPublic } from './landing'
import { QBasic, QMood, QPlan } from './questions'
import { CostLoading, CostResult } from './cost'
import { Roadmap } from './road'
import { StepPage } from './step'
import { SdmList, VenueList } from './venue'
import { Compare, VendorDetail } from './vendor'
import { Home, InviteLanding, MyInfo } from './home'
import { Overlays } from './overlays'

function Base({ id }: { id: ScreenId }) {
  const p = id.split('-')[0]
  switch (id) {
    case 'MAIN-01': return <MainPublic />
    case 'MAIN-02': return <MainIntro />
    case 'MAIN-03': case 'MAIN-04': return <MainMember />
    case 'Q-01': return <QBasic />
    case 'Q-02': case 'Q-03': return <QPlan />
    case 'Q-04': return <QMood />
    case 'COST-01': return <CostLoading />
    case 'LOGIN-01': return <CostResult />
    case 'LOGIN-02': case 'LOGIN-03': case 'LOGIN-05': return <StepPage />
    case 'LOGIN-04': case 'INVITE-01': case 'STEP-06': case 'STEP-07': return <Roadmap />
    case 'VENDOR-01': case 'VENDOR-02': return <VendorDetail />
    case 'VENDOR-03': case 'VENDOR-04': case 'VENDOR-05': return <Compare />
    case 'INVITE-02': case 'INVITE-03': case 'INVITE-04': case 'INVITE-05': return <InviteLanding />
  }
  switch (p) {
    case 'COST': return <CostResult />
    case 'ROAD': return <Roadmap />
    case 'STEP': return <StepPage />
    case 'VENUE': return <VenueList />
    case 'SDM': return <SdmList />
    case 'HOME': return <Home />
    case 'MY': return <MyInfo />
  }
  return null
}

export function Screen({ id }: { id: ScreenId }) {
  return (<div className="relative"><Base id={id} /><Overlays /></div>)
}
