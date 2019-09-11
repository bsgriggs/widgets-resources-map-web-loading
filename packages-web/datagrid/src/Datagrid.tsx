import { createElement, ReactElement, useCallback, useState } from "react";
import { DatagridContainerProps } from "../typings/DatagridProps";

import "./ui/Datagrid.scss";
import { Table } from "./components/Table";

export default function Datagrid(props: DatagridContainerProps): ReactElement {
    const isServerSide = !(props.columnsFilterable || props.columnsSortable);
    const isInfiniteLoad = !props.pagingEnabled && isServerSide;
    const currentPage = isInfiniteLoad
        ? props.datasource.limit / props.pageSize
        : props.datasource.offset / props.pageSize;

    useState(() => {
        if (isServerSide) {
            if (props.datasource.limit === Number.POSITIVE_INFINITY) {
                props.datasource.setLimit(props.pageSize);
            }
        } else {
            props.datasource.setLimit(undefined);
            props.datasource.setOffset(0);
        }
    });

    const setPage = useCallback(
        computePage => {
            const newPage = computePage(currentPage);
            if (isInfiniteLoad) {
                props.datasource.setLimit((newPage + 1) * props.pageSize);
            } else {
                props.datasource.setOffset(newPage * props.pageSize);
            }
        },
        [props.datasource, props.pageSize, isInfiniteLoad, currentPage]
    );

    return (
        <Table
            className={props.class}
            columns={props.columns}
            columnsDraggable={props.columnsDraggable}
            columnsFilterable={props.columnsFilterable}
            columnsHidable={props.columnsHidable}
            columnsResizable={props.columnsResizable}
            columnsSortable={props.columnsSortable}
            data={props.datasource.items ?? []}
            footerWidgets={<div className="header">{props.footerWidgets}</div>}
            hasMoreItems={props.datasource.hasMoreItems ?? false}
            headerWidgets={<div className="footer">{props.headerWidgets}</div>}
            numberOfPages={
                props.datasource.totalCount !== undefined
                    ? Math.ceil(props.datasource.totalCount / props.pageSize)
                    : undefined
            }
            page={currentPage}
            pageSize={props.pageSize}
            paging={props.pagingEnabled}
            pagingPosition={props.pagingPosition}
            setPage={setPage}
            styles={props.style}
            cellRenderer={useCallback(
                (Wrapper, value, columnIndex) => {
                    const column = props.columns[columnIndex];
                    return (
                        <Wrapper>
                            {column.hasWidgets && column.content
                                ? column.content(value)
                                : column.attribute(value).displayValue}
                        </Wrapper>
                    );
                },
                [props.columns]
            )}
            valueForFilter={useCallback(
                (value, columnIndex) => {
                    const column = props.columns[columnIndex];
                    return column.attribute(value).displayValue;
                },
                [props.columns]
            )}
        />
    );
}