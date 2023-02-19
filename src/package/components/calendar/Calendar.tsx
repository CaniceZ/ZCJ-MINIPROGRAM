import { FC } from 'react'
import Popup from '../popup'
import type { Props as PopupProps } from '../popup'
import CalendarItem from './CalendarItem'
import Utils from '../../utils/date'

export interface CalendarProps extends Omit<PopupProps, 'placement' | 'existSafeArea' | 'width'> {
  type?: string
  isAutoBackFill?: boolean
  poppable?: boolean
  defaultValue?: string | string[]
  startDate?: string
  endDate?: string
  onChoose?: (param: string) => void
}

const Calendar: FC<CalendarProps> = (props) => {
  const {
    poppable = true,
    type = 'one',
    isAutoBackFill = false,
    defaultValue = '',
    startDate = Utils.getDay(0),
    endDate = Utils.getDay(365),
    onClose,
    onChoose,
  } = props

  const close = () => {
    onClose?.()
  }
  const update = () => {}
  const choose = (param: string) => {
    close()
    onChoose && onChoose(param)
  }

  return (
    <>
      {poppable ? (
        <Popup {...props} height='90%'>
          <CalendarItem
            type={type}
            isAutoBackFill={isAutoBackFill}
            poppable={poppable}
            defaultValue={defaultValue}
            startDate={startDate}
            endDate={endDate}
            onUpdate={update}
            onClose={close}
            onChoose={choose}
          />
        </Popup>
      ) : (
        <CalendarItem
          type={type}
          isAutoBackFill={isAutoBackFill}
          poppable={poppable}
          defaultValue={defaultValue}
          startDate={startDate}
          endDate={endDate}
          onClose={close}
          onChoose={choose}
        />
      )}
    </>
  )
}

export default Calendar
