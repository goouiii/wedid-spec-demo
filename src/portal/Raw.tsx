import { useParams } from 'react-router-dom'
import { screenById } from '../data/spec'
import type { ScreenId } from '../demo/state'
import { StaticScreen } from './Static'

/** 검수용: 화면을 원래 크기(1440)로 번호 없이 보여준다 (메뉴에 노출하지 않음) */
export function RawPage() {
  const { id } = useParams()
  if (!id || !screenById(id)) return null
  return <div className="w-[1440px]"><StaticScreen id={id as ScreenId} /></div>
}
