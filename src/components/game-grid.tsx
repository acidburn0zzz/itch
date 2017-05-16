
import * as React from "react";
import {connect, I18nProps} from "./connect";

import HubItem from "./hub-item";
import HiddenIndicator from "./hidden-indicator";

import GameModel from "../models/game";

import {AutoSizer, Grid} from "react-virtualized";
import {IAutoSizerParams} from "./autosizer-types";

import {HubGamesDiv} from "./games";
import styled from "./styles";

interface ICellInfo {
  columnIndex: number;
  key: string;
  rowIndex: number;
  style: React.CSSProperties;
}

interface ILayoutInfo {
  columnCount: number;
  games: GameModel[];
}

const StyledGrid = styled(Grid)`
  outline: none;
`;

class GameGrid extends React.Component<IProps & IDerivedProps & I18nProps, IState> {
  constructor () {
    super();
    this.state = {
      scrollTop: 0,
    };
    this.cellRenderer = this.cellRenderer.bind(this);
  }

  render () {
    const {games, hiddenCount, tab} = this.props;

    return <HubGamesDiv>
      <AutoSizer>
      {({width, height}: IAutoSizerParams) => {
        const columnCount = Math.floor(width / 280);
        const rowCount = Math.ceil(games.length / columnCount);
        const columnWidth = ((width - 10) / columnCount);
        const rowHeight = columnWidth * 1.12;
        const scrollTop = height === 0 ? 0 : this.state.scrollTop;

        return <StyledGrid
          ref="grid"
          cellRenderer={this.cellRenderer.bind(this, {games, columnCount})}
          width={width}
          height={height}
          columnWidth={columnWidth}
          columnCount={columnCount}
          rowCount={rowCount}
          rowHeight={rowHeight}
          overscanRowCount={3}
          onScroll={(e: any) => {
            // ignore data when tab's hidden
            if (e.clientHeight <= 0) { return; }
            this.setState({ scrollTop: e.scrollTop });
          }}
          scrollTop={scrollTop}
          scrollPositionChangeReason="requested"
        />;
      }}
      </AutoSizer>
      <HiddenIndicator count={hiddenCount} tab={tab}/>
    </HubGamesDiv>;
  }

  cellRenderer(layout: ILayoutInfo, cell: ICellInfo): JSX.Element {
    const gameIndex = (cell.rowIndex * layout.columnCount) + cell.columnIndex;
    const game = layout.games[gameIndex];

    const style = cell.style;
    style.padding = "10px";
    if (cell.columnIndex < layout.columnCount - 1) {
      style.marginRight = "10px";
    }

    return <div key={cell.key} style={cell.style}>
      {
        game
        ? <HubItem
            key={`game-${game.id}`}
            game={game}/>
        : null
      }
    </div>;
  }
}

interface IProps {
  games: GameModel[];
  hiddenCount: number;
  tab: string;
}

interface IDerivedProps {}

interface IState {
  scrollTop: 0;
}

export default connect<IProps>(GameGrid);
