# frozen_string_literal: true

module RuboCop
  module Cop
    module Studio51

      # Enforces the Studio51 documentation-block shape.
      #
      # Prose and `@` tag lines are separated by a bare `#`, and a block whose
      # last line is prose ends with a bare `#` before the code it documents.
      # A block whose last line is a tag needs no terminator.
      #
      # @example
      #   # bad
      #   # Build the request body.
      #   def build_body
      #
      #   # good
      #   # Build the request body.
      #   #
      #   def build_body
      #
      #   # bad
      #   # Build the request body.
      #   # @return [Hash] the request body
      #   def build_body
      #
      #   # good
      #   # Build the request body.
      #   #
      #   # @return [Hash] the request body
      #   def build_body
      #
      class CommentBlockTermination < Base
        extend AutoCorrector

        MSG_TERMINATOR = "End the comment with a bare `#` line before the code it documents."
        MSG_SEPARATOR  = "Separate prose from `@` tag lines with a bare `#` line."

        TAG_LINE       = /\A#\s*@\w+/
        DIRECTIVE_LINE = %r{\A#(!|\s*(rubocop:|frozen_string_literal:|encoding:))}

        # @return [void]
        def on_new_investigation
          comment_blocks.each do |block|
            check_tag_separation(block)
            check_terminator(block)
          end
        end

        private

        # Whole-line comments, grouped into blocks of consecutive lines.
        #
        # @return [Array<Array<Parser::Source::Comment>>] the comment blocks
        def comment_blocks
          whole_line_comments.chunk_while { |a, b| b.loc.line == a.loc.line + 1 }.to_a
        end

        # @return [Array<Parser::Source::Comment>] full-line, non-directive comments
        def whole_line_comments
          processed_source.comments.select do |comment|
            comment.loc.expression.source_line.lstrip.start_with?("#") &&
              !comment.text.match?(DIRECTIVE_LINE)
          end
        end

        # Require a bare `#` between the last prose line and the first tag line.
        #
        # @param block [Array<Parser::Source::Comment>] one comment block
        # @return [void]
        def check_tag_separation(block)
          first_tag_index = block.index { |comment| tag?(comment) }
          return if first_tag_index.nil? || first_tag_index.zero?

          previous = block[first_tag_index - 1]
          return if bare?(previous)

          add_offense(previous, message: MSG_SEPARATOR) do |corrector|
            corrector.insert_after(previous.loc.expression, "\n#{indent(previous)}#")
          end
        end

        # Require a bare `#` terminator when a block ends in prose right above code.
        #
        # @param block [Array<Parser::Source::Comment>] one comment block
        # @return [void]
        def check_terminator(block)
          return unless followed_by_code?(block)

          last = block.last
          return if bare?(last) || tag?(last)

          add_offense(last, message: MSG_TERMINATOR) do |corrector|
            corrector.insert_after(last.loc.expression, "\n#{indent(last)}#")
          end
        end

        # @param block [Array<Parser::Source::Comment>] one comment block
        # @return [Boolean] whether the line right after the block holds code
        def followed_by_code?(block)
          line = processed_source.lines[block.last.loc.line] # lines is 0-indexed; this is the next line
          !line.nil? && !line.strip.empty?
        end

        # @param comment [Parser::Source::Comment] a comment line
        # @return [Boolean] whether it is a bare `#`
        def bare?(comment)
          comment.text.strip == "#"
        end

        # @param comment [Parser::Source::Comment] a comment line
        # @return [Boolean] whether it is a YARD tag line
        def tag?(comment)
          comment.text.match?(TAG_LINE)
        end

        # @param comment [Parser::Source::Comment] a comment line
        # @return [String] the block's leading whitespace
        def indent(comment)
          " " * comment.loc.column
        end
      end
    end
  end
end
