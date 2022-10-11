import { Component, Host, h, State, Watch, JSX, Fragment } from '@stencil/core';
import { ColumnDef, getCoreRowModel, getExpandedRowModel, Row, Table, TableState } from '@tanstack/table-core';
import { makeData, Person } from '../../utils/make-data';
import { flexRender, useStencilTable } from '../../utils/stencil-adapter';

type TableProps<TData> = {
  table: Table<TData>,
  table2: Table<TData>,
  SubComponent?: (props: { table: Table<TData> }) => JSX.Element,
}

@Component({
  tag: 'table-sub-components',
  styleUrl: 'table-sub-components.css',
  shadow: true,
})
export class TableSubComponents {

  @State() table: Table<Person>;
  @State() table2: Table<Person>;

  @State() tableState: TableState | {} = {};
  @State() tableState2: TableState | {} = {};

  @Watch('tableState')
  watchTableStateHandler(newTableState: TableState, oldTableState: TableState) {
    console.log('watchTableStateHandler');
    this.createTable();
  }

  @Watch('tableState2')
  watchTableStateHandler2(newTableState: TableState, oldTableState: TableState) {
    console.log('watchTableStateHandler2');
    this.createTable2();
  }

  @State() data: Person[] = makeData(10);
  @State() data2: Person[] = makeData(5);

  @State() columns: ColumnDef<Person>[] = [
    {
      header: 'Name',
      footer: props => props.column.id,
      columns: [
        {
          id: 'expander',
          header: () => null,
          cell: ({ row }) => {
            return row.getCanExpand() ? (
              <button
                {...{
                  onClick: row.getToggleExpandedHandler(),
                  style: { cursor: 'pointer' },
                }}
              >
                {row.getIsExpanded() ? '👇' : '👉'}
              </button>
            ) : (
              '🔵'
            );
          },
        },
        {
          accessorKey: 'firstName',
          header: 'First Name',
          cell: ({ row, getValue }) => (
            <div
              style={{
                // Since rows are flattened by default,
                // we can use the row.depth property
                // and paddingLeft to visually indicate the depth
                // of the row
                paddingLeft: `${row.depth * 2}rem`,
              }}
            >
              {getValue<string>()}
            </div>
          ),
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
  @State() columns2: ColumnDef<Person>[] = [
    {
      header: 'Name',
      footer: props => props.column.id,
      columns: [
        {
          id: 'expander',
          header: () => null,
          cell: ({ row }) => {
            return row.getCanExpand() ? (
              <button
                {...{
                  onClick: row.getToggleExpandedHandler(),
                  style: { cursor: 'pointer' },
                }}
              >
                {row.getIsExpanded() ? '👇' : '👉'}
              </button>
            ) : (
              '🔵'
            );
          },
        },
        {
          accessorKey: 'firstName',
          header: 'First Name',
          cell: ({ row, getValue }) => (
            <div
              style={{
                // Since rows are flattened by default,
                // we can use the row.depth property
                // and paddingLeft to visually indicate the depth
                // of the row
                paddingLeft: `${row.depth * 2}rem`,
              }}
            >
              {getValue<string>()}
            </div>
          ),
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

  /**
   * Render the table for the first time.
   */
  componentWillLoad() {
    console.log('componentWillLoad');
    this.createTable();
    this.createTable2();
  }

  /**
   * Create a new table instance based on the component properties.
   */
  createTable() {
    console.log('createTable');
    this.table = useStencilTable<Person>({
      state: { ...this.tableState },
      data: this.data,
      columns: this.columns,
      getCoreRowModel: getCoreRowModel(),
      getRowCanExpand: () => true, // TODO: We could pass this dynamically as a parameter, if needed.
      getExpandedRowModel: getExpandedRowModel(),
      onStateChange: (updater) => {
        console.log('onStateChange');
        this.tableState = (typeof updater === 'function') ? updater(this.table.getState()) : updater;
      },
      // debugAll: true,
    });
  }

  /**
   * Create a new table instance based on the component properties.
   */
  createTable2() {
    console.log('createTable2');
    this.table2 = useStencilTable<Person>({
      state: { ...this.tableState2 },
      data: this.data2,
      columns: this.columns2,
      getCoreRowModel: getCoreRowModel(),
      getRowCanExpand: () => true, // TODO: We could pass this dynamically as a parameter, if needed.
      getExpandedRowModel: getExpandedRowModel(),
      onStateChange: (updater) => {
        console.log('onStateChange');
        this.tableState2 = (typeof updater === 'function') ? updater(this.table2.getState()) : updater;
      },
      // debugAll: true,
    });
  }

  /**
   * Refresh the table rendering from scratch by passing the same state as a new variable reference
   * (this is possible through the Watch() decorator on "tableState").
   */
  refreshTable() {
    this.tableState = { ...this.tableState };
  }

  /**
   * Refresh the table rendering from scratch by passing the same state as a new variable reference
   * (this is possible through the Watch() decorator on "tableState").
   */
  refreshTable2() {
    this.tableState2 = { ...this.tableState2 };
  }

  /**
   * The <Table> component.
   *
   * @param table
   * @param SubComponent
   * @constructor
   */
  Table({ table, table2, SubComponent }: TableProps<Person>): JSX.Element {
    return (
      <div class={`table`}>
        <table>
          <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
          </thead>
          <tbody>
          {table.getRowModel().rows.map(row => {
            // TODO: The fragment below should have the key prop??
            return (
              <Fragment>
                <tr>
                  {/* first row is a normal row */}
                  {row.getVisibleCells().map(cell => {
                    return (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    );
                  })}
                </tr>
                {row.getIsExpanded() && (
                  <tr>
                    {/* 2nd row is a custom 1 cell row */}
                    {!!SubComponent ? (
                      <td colSpan={row.getVisibleCells().length}>
                        {SubComponent({ table: table2 })}
                      </td>
                    ) : (
                      <td>NO SUB COMPONENT PASSED</td>
                    )}
                  </tr>
                )}
              </Fragment>
            );
          })}
          </tbody>
        </table>
        {/*<div>{table.getRowModel().rows.length} Rows</div>*/}
        {/*<br /><br /><br />*/}
        {/*<pre>*/}
        {/*  {JSON.stringify(*/}
        {/*    {*/}
        {/*      table: table,*/}
        {/*    },*/}
        {/*    null,*/}
        {/*    2,*/}
        {/*  )}*/}
        {/*</pre>*/}
      </div>
    );
  }

  /**
   * The <Table> component.
   *
   * @param table
   * @param SubComponent
   * @constructor
   */
  Table2({ table, SubComponent }: TableProps<Person>): JSX.Element {
    return (
      <div class={`table-2`}>
        <table>
          <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
          </thead>
          <tbody>
          {table.getRowModel().rows.map(row => {
            // TODO: The fragment below should have the key prop??
            return (
              <Fragment>
                <tr>
                  {/* first row is a normal row */}
                  {row.getVisibleCells().map(cell => {
                    return (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    );
                  })}
                </tr>
                {row.getIsExpanded() && (
                  <tr>
                    {/* 2nd row is a custom 1 cell row */}
                    // TODO: How to dynamically handle a third table or even more??
                      <td>NO SUB COMPONENT PASSED</td>
                  </tr>
                )}
              </Fragment>
            );
          })}
          </tbody>
        </table>
        {/*<div>{table.getRowModel().rows.length} Rows</div>*/}
        {/*<br /><br /><br />*/}
        {/*<pre>*/}
        {/*  {JSON.stringify(*/}
        {/*    {*/}
        {/*      table: table,*/}
        {/*    },*/}
        {/*    null,*/}
        {/*    2,*/}
        {/*  )}*/}
        {/*</pre>*/}
      </div>
    );
  }

  /**
   * The <SubComponent> sub-component.
   *
   * @param row
   * @constructor
   */
  SubComponent({ row }: { row: Row<Person> }) {
    return (
      <pre style={{ fontSize: '10px' }}>
        <code>{JSON.stringify(row.original, null, 2)}</code>
      </pre>
    );
  }

  /**
   * The table rendering function.
   */
  render() {
    if (!Object.keys(this.table).length) return <h2>table-error</h2>;

    return (
      <Host>
        <h2>table-sub-components</h2>

        <this.Table table={this.table} table2={this.table2} SubComponent={this.Table2} />
      </Host>
    );
  }

}
