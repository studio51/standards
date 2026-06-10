# frozen_string_literal: true

module RuboCop
  module Cop
    module Studio51

      # Lets methods breathe: in a multi-statement method body, the final
      # expression is preceded by an empty line (a comment line also counts
      # as breathing room).
      #
      # Runs of parallel setup statements (assignments / attribute writes, as
      # in an `initialize`) are left tight — the rule is about separating a
      # method's produced value from the work above it.
      #
      # @example
      #   # bad
      #   def resolve
      #     value = lookup
      #     transform(value)
      #   end
      #
      #   # good
      #   def resolve
      #     value = lookup
      #
      #     transform(value)
      #   end
      #
      #   # good — parallel setup stays tight
      #   def initialize
      #     @mutex = Mutex.new
      #     @cache = {}
      #   end
      #
      class EmptyLineBeforeTrailingExpression < Base
        extend AutoCorrector
        include RangeHelp

        MSG = "Let the method breathe — add an empty line before its final expression."

        SETUP_TYPES = %i[lvasgn ivasgn cvasgn gvasgn casgn masgn op_asgn or_asgn and_asgn].freeze

        # @param node [RuboCop::AST::DefNode] the method definition
        # @return [void]
        def on_def(node)
          body = node.body
          return unless body&.begin_type?

          *rest, last = body.children
          previous = rest.last
          return unless previous
          return if setup_statement?(last) && setup_statement?(previous)
          return if last.source_range.first_line == previous.source_range.last_line
          return if last.source_range.first_line - previous.source_range.last_line >= 2

          add_offense(last) do |corrector|
            corrector.insert_before(range_by_whole_lines(last.source_range), "\n")
          end
        end
        alias on_defs on_def

        private

        # Whether the statement is setup work (an assignment or attribute write,
        # possibly behind a guard modifier) rather than a produced value.
        #
        # @param node [RuboCop::AST::Node] a statement in the method body
        # @return [Boolean] whether it is a setup statement
        def setup_statement?(node)
          node = node.branches.compact.first if node.if_type? && node.modifier_form?
          return false unless node

          SETUP_TYPES.include?(node.type) || (node.send_type? && node.assignment_method?)
        end
      end
    end
  end
end
