import { Component, Host, h, State, Watch, Prop } from '@stencil/core';
import {
  ColumnDef,
  ColumnResizeMode,
  getCoreRowModel,
  Table,
  TableState,
} from '@tanstack/table-core';
import { flexRender, useStencilTable } from '../../utils/stencil-adapter';

export type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

@Component({
  tag: 'table-column-sizing',
  styleUrl: 'table-column-sizing.css',
  shadow: true,
})
export class TableColumnSizing {

  @State() table: Table<Person>;

  @State() state: TableState | null = null;

  @State() data: Person[] = [
    {
      firstName: 'tanner',
      lastName: 'linsley',
      age: 24,
      visits: 100,
      status: 'In Relationship',
      progress: 50,
    },
    {
      firstName: 'tandy',
      lastName: 'miller',
      age: 40,
      visits: 40,
      status: 'Single',
      progress: 80,
    },
    {
      firstName: 'joe',
      lastName: 'dirte',
      age: 45,
      visits: 20,
      status: 'Complicated',
      progress: 10,
    },
  ];

  @State() columns: ColumnDef<Person>[] = [
    {
      header: 'Name',
      footer: props => props.column.id,
      columns: [
        {
          accessorKey: 'firstName',
          cell: info => info.getValue(),
          footer: props => props.column.id,
        },
        {
          accessorFn: row => row.lastName,
          id: 'lastName',
          cell: info => info.getValue(),
          header: () => <span>Last Name</span>,
          footer: props => props.column.id,
        },
      ],
    },
    {
      header: 'Info',
      footer: props => props.column.id,
      columns: [
        {
          accessorKey: 'age',
          header: () => 'Age',
          footer: props => props.column.id,
        },
        {
          header: 'More Info',
          columns: [
            {
              accessorKey: 'visits',
              header: () => <span>Visits</span>,
              footer: props => props.column.id,
            },
            {
              accessorKey: 'status',
              header: 'Status',
              footer: props => props.column.id,
            },
            {
              accessorKey: 'progress',
              header: 'Profile Progress',
              footer: props => props.column.id,
            },
          ],
        },
      ],
    },
  ];

  @Prop() column_resize_mode: ColumnResizeMode = 'onChange';

  @Watch('state')
  watchStateHandler(newValue: TableState) {
    this.table = useStencilTable<Person>({
      state: newValue,
      data: this.data,
      columns: this.columns,
      columnResizeMode: this.column_resize_mode,
      getCoreRowModel: getCoreRowModel(),
      onStateChange: (updater) => {
        this.state = (typeof updater === 'function') ? updater(this.table.getState()) : updater;
      },
      debugTable: true,
      debugHeaders: true,
      debugColumns: true,
    });
  }

  componentWillLoad() {
    this.watchStateHandler(this.state);
  }

  toggleResizeMode() {
    this.column_resize_mode = ('onChange' === this.column_resize_mode) ? 'onEnd' : 'onChange';
    this.updateTable();
  }

  updateTable(newState: TableState = this.state) {
    this.state = { ...newState };
  }

  render() {
    return (
      <Host>
        <h2>table-column-sizing</h2>

        <table {...{ style: { width: this.table.getCenterTotalSize().toString() + 'px' } }}>
          <thead>
          {this.table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  {...{
                    key: header.id,
                    colSpan: header.colSpan,
                    style: {
                      width: header.getSize().toString() + 'px',
                    },
                  }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  <div
                    {...{
                      onMouseDown: header.getResizeHandler(),
                      onTouchStart: header.getResizeHandler(),
                      className: `resizer ${
                        header.column.getIsResizing() ? 'isResizing' : ''
                      }`,
                    }}
                  />
                </th>
              ))}
            </tr>
          ))}
          </thead>
          <tbody>
          {this.table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td
                  {...{
                    key: cell.id,
                    style: {
                      width: cell.column.getSize().toString() + 'px',
                    },
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
          </tbody>
        </table>
        <br /><br /><br />
        <button onClick={() => this.toggleResizeMode()}>toggleResizeMode</button>
        <br /><br /><br />
        <pre>
        {JSON.stringify(
          {
            tableState: this.table.getState(),
          },
          null,
          2,
        )}
      </pre>
      </Host>
    );
  }

}
