import { ScrollView } from 'react-native'
import { parseMarkdown, type InlineToken } from '../libs/markdown'
import * as S from './style'

/**
 * Desenha o markdown ja reconhecido por `libs/markdown`. As cores saem do tema
 * do styled-components, entao o componente recebe so o texto.
 */
export function MarkdownText({ content }: { content: string }) {
  return (
    <S.Markdown>
      {parseMarkdown(content).map((line, index) => {
        switch (line.kind) {
          case 'blank':
            return <S.Spacer key={index} />

          case 'rule':
            return <S.Rule key={index} />

          case 'heading':
            return <S.Heading key={index}>{renderInline(line.tokens)}</S.Heading>

          case 'listItem':
            return (
              <S.ListRow key={index}>
                <S.ListMarker>{line.marker}</S.ListMarker>
                <S.Paragraph>{renderInline(line.tokens)}</S.Paragraph>
              </S.ListRow>
            )

          case 'paragraph':
            return <S.Paragraph key={index}>{renderInline(line.tokens)}</S.Paragraph>

          case 'table':
            return (
              <ScrollView key={index} horizontal showsHorizontalScrollIndicator={false}>
                <S.Table>
                  <S.TableRow $header>
                    {line.header.map((cell, cellIndex) => (
                      <S.TableCell key={cellIndex} $align={line.align[cellIndex] ?? 'left'}>
                        <S.TableCellText $header>{renderInline(cell)}</S.TableCellText>
                      </S.TableCell>
                    ))}
                  </S.TableRow>

                  {line.rows.map((row, rowIndex) => (
                    <S.TableRow key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <S.TableCell key={cellIndex} $align={line.align[cellIndex] ?? 'left'}>
                          <S.TableCellText>{renderInline(cell)}</S.TableCellText>
                        </S.TableCell>
                      ))}
                    </S.TableRow>
                  ))}
                </S.Table>
              </ScrollView>
            )
        }
      })}
    </S.Markdown>
  )
}

function renderInline(tokens: InlineToken[]) {
  return tokens.map((token, index) => {
    switch (token.kind) {
      case 'bold':
        return <S.Bold key={index}>{token.value}</S.Bold>
      case 'code':
        return <S.Code key={index}>{token.value}</S.Code>
      case 'text':
        return token.value
    }
  })
}
