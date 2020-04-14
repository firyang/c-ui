import Icon from './icon'
import Input from './input'
import Radio from './radio'
import RadioGroup from './radio-group'
import RadioButton from './radio-button'
import Button from './button'
import ButtonGroup from './button-group'
import Row from './layout/row'
import Col from './layout/col'
import Container from './container/container'
import Header from './container/header'
import Main from './container/main'
import Aside from './container/aside'
import Footer from './container/footer'
import Upload from './upload/upload'
import TimeLine from './time-line'
import DatePicker from './date-picker/date-picker'
import Popover from './popover'

const install = Vue => {
    Vue.component(Icon.name, Icon)
    Vue.component(Input.name, Input)
    Vue.component(Radio.name, Radio)
    Vue.component(RadioGroup.name, RadioGroup)
    Vue.component(RadioButton.name, RadioButton)
    Vue.component(Button.name, Button)
    Vue.component(ButtonGroup.name, ButtonGroup)
    Vue.component(Row.name, Row)
    Vue.component(Col.name, Col)
    Vue.component(Container.name, Container)
    Vue.component(Header.name, Header)
    Vue.component(Main.name, Main)
    Vue.component(Aside.name, Aside)
    Vue.component(Footer.name, Footer)
    Vue.component(Upload.name, Upload)
    Vue.component(TimeLine.name, TimeLine)
    Vue.component(DatePicker.name, DatePicker)
    Vue.component(Popover.name, Popover)
}

export default install