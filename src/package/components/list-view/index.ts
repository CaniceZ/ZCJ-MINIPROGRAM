import InternalListView from './ListView'
import useListView from './useListView'

type InternalListViewType = typeof InternalListView
interface ListViewType extends InternalListViewType {
  useListView: typeof useListView
}

const ListView = InternalListView as ListViewType

ListView.useListView = useListView

export default ListView
