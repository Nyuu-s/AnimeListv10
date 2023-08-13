/* AutoGenerated Code, changes may be overwritten
* INPUT GRAMMAR:
* query := query=or
* or := left=or ws* bool_op='\|' ws* right=and ws* | and
* and := left=and ws* bool_op='&' ws* right=statement ws* | statement
* statement := not=not_statement ws* | comparison
* not_statement := '!' value=statement 
* comparison := id=id ws* comp_op=comp_op ws* value=value | id=id ws* 'in' ws* '\['ws* values=value_list ws*'\]' | '\(' ws* query=or ws*'\)'
* id := alphanumeric*
* comp_op :=  '<=' | '>=' | '<' | '>' | '==' | '='
* value := alphanumeric*
* value_list := head=value tail={ws* ',' ws* element=value}* 
* alphanumeric := '[a-zA-Z0-9]+'
* ws := ' '
*/
type Nullable<T> = T | null;
type $$RuleType<T> = () => Nullable<T>;
export interface ASTNodeIntf {
    kind: ASTKinds;
}
export enum ASTKinds {
    query = "query",
    or_1 = "or_1",
    or_2 = "or_2",
    and_1 = "and_1",
    and_2 = "and_2",
    statement_1 = "statement_1",
    statement_2 = "statement_2",
    not_statement = "not_statement",
    comparison_1 = "comparison_1",
    comparison_2 = "comparison_2",
    comparison_3 = "comparison_3",
    id = "id",
    comp_op_1 = "comp_op_1",
    comp_op_2 = "comp_op_2",
    comp_op_3 = "comp_op_3",
    comp_op_4 = "comp_op_4",
    comp_op_5 = "comp_op_5",
    comp_op_6 = "comp_op_6",
    value = "value",
    value_list = "value_list",
    value_list_$0 = "value_list_$0",
    alphanumeric = "alphanumeric",
    ws = "ws",
}
export interface query {
    kind: ASTKinds.query;
    query: or;
}
export type or = or_1 | or_2;
export interface or_1 {
    kind: ASTKinds.or_1;
    left: or;
    bool_op: string;
    right: and;
}
export type or_2 = and;
export type and = and_1 | and_2;
export interface and_1 {
    kind: ASTKinds.and_1;
    left: and;
    bool_op: string;
    right: statement;
}
export type and_2 = statement;
export type statement = statement_1 | statement_2;
export interface statement_1 {
    kind: ASTKinds.statement_1;
    not: not_statement;
}
export type statement_2 = comparison;
export interface not_statement {
    kind: ASTKinds.not_statement;
    value: statement;
}
export type comparison = comparison_1 | comparison_2 | comparison_3;
export interface comparison_1 {
    kind: ASTKinds.comparison_1;
    id: id;
    comp_op: comp_op;
    value: value;
}
export interface comparison_2 {
    kind: ASTKinds.comparison_2;
    id: id;
    values: value_list;
}
export interface comparison_3 {
    kind: ASTKinds.comparison_3;
    query: or;
}
export type id = alphanumeric[];
export type comp_op = comp_op_1 | comp_op_2 | comp_op_3 | comp_op_4 | comp_op_5 | comp_op_6;
export type comp_op_1 = string;
export type comp_op_2 = string;
export type comp_op_3 = string;
export type comp_op_4 = string;
export type comp_op_5 = string;
export type comp_op_6 = string;
export type value = alphanumeric[];
export interface value_list {
    kind: ASTKinds.value_list;
    head: value;
    tail: value_list_$0[];
}
export interface value_list_$0 {
    kind: ASTKinds.value_list_$0;
    element: value;
}
export type alphanumeric = string;
export type ws = string;
export class Parser {
    private readonly input: string;
    private pos: PosInfo;
    private negating: boolean = false;
    private memoSafe: boolean = true;
    constructor(input: string) {
        this.pos = {overallPos: 0, line: 1, offset: 0};
        this.input = input;
    }
    public reset(pos: PosInfo) {
        this.pos = pos;
    }
    public finished(): boolean {
        return this.pos.overallPos === this.input.length;
    }
    public clearMemos(): void {
        this.$scope$or$memo.clear();
        this.$scope$and$memo.clear();
    }
    protected $scope$or$memo: Map<number, [Nullable<or>, PosInfo]> = new Map();
    protected $scope$and$memo: Map<number, [Nullable<and>, PosInfo]> = new Map();
    public matchquery($$dpth: number, $$cr?: ErrorTracker): Nullable<query> {
        return this.run<query>($$dpth,
            () => {
                let $scope$query: Nullable<or>;
                let $$res: Nullable<query> = null;
                if (true
                    && ($scope$query = this.matchor($$dpth + 1, $$cr)) !== null
                ) {
                    $$res = {kind: ASTKinds.query, query: $scope$query};
                }
                return $$res;
            });
    }
    public matchor($$dpth: number, $$cr?: ErrorTracker): Nullable<or> {
        const fn = () => {
            return this.choice<or>([
                () => this.matchor_1($$dpth + 1, $$cr),
                () => this.matchor_2($$dpth + 1, $$cr),
            ]);
        };
        const $scope$pos = this.mark();
        const memo = this.$scope$or$memo.get($scope$pos.overallPos);
        if(memo !== undefined) {
            this.reset(memo[1]);
            return memo[0];
        }
        const $scope$oldMemoSafe = this.memoSafe;
        this.memoSafe = false;
        this.$scope$or$memo.set($scope$pos.overallPos, [null, $scope$pos]);
        let lastRes: Nullable<or> = null;
        let lastPos: PosInfo = $scope$pos;
        for(;;) {
            this.reset($scope$pos);
            const res = fn();
            const end = this.mark();
            if(end.overallPos <= lastPos.overallPos)
                break;
            lastRes = res;
            lastPos = end;
            this.$scope$or$memo.set($scope$pos.overallPos, [lastRes, lastPos]);
        }
        this.reset(lastPos);
        this.memoSafe = $scope$oldMemoSafe;
        return lastRes;
    }
    public matchor_1($$dpth: number, $$cr?: ErrorTracker): Nullable<or_1> {
        return this.run<or_1>($$dpth,
            () => {
                let $scope$left: Nullable<or>;
                let $scope$bool_op: Nullable<string>;
                let $scope$right: Nullable<and>;
                let $$res: Nullable<or_1> = null;
                if (true
                    && ($scope$left = this.matchor($$dpth + 1, $$cr)) !== null
                    && this.loop<ws>(() => this.matchws($$dpth + 1, $$cr), 0, -1) !== null
                    && ($scope$bool_op = this.regexAccept(String.raw`(?:\|)`, "", $$dpth + 1, $$cr)) !== null
                    && this.loop<ws>(() => this.matchws($$dpth + 1, $$cr), 0, -1) !== null
                    && ($scope$right = this.matchand($$dpth + 1, $$cr)) !== null
                    && this.loop<ws>(() => this.matchws($$dpth + 1, $$cr), 0, -1) !== null
                ) {
                    $$res = {kind: ASTKinds.or_1, left: $scope$left, bool_op: $scope$bool_op, right: $scope$right};
                }
                return $$res;
            });
    }
    public matchor_2($$dpth: number, $$cr?: ErrorTracker): Nullable<or_2> {
        return this.matchand($$dpth + 1, $$cr);
    }
    public matchand($$dpth: number, $$cr?: ErrorTracker): Nullable<and> {
        const fn = () => {
            return this.choice<and>([
                () => this.matchand_1($$dpth + 1, $$cr),
                () => this.matchand_2($$dpth + 1, $$cr),
            ]);
        };
        const $scope$pos = this.mark();
        const memo = this.$scope$and$memo.get($scope$pos.overallPos);
        if(memo !== undefined) {
            this.reset(memo[1]);
            return memo[0];
        }
        const $scope$oldMemoSafe = this.memoSafe;
        this.memoSafe = false;
        this.$scope$and$memo.set($scope$pos.overallPos, [null, $scope$pos]);
        let lastRes: Nullable<and> = null;
        let lastPos: PosInfo = $scope$pos;
        for(;;) {
            this.reset($scope$pos);
            const res = fn();
            const end = this.mark();
            if(end.overallPos <= lastPos.overallPos)
                break;
            lastRes = res;
            lastPos = end;
            this.$scope$and$memo.set($scope$pos.overallPos, [lastRes, lastPos]);
        }
        this.reset(lastPos);
        this.memoSafe = $scope$oldMemoSafe;
        return lastRes;
    }
    public matchand_1($$dpth: number, $$cr?: ErrorTracker): Nullable<and_1> {
        return this.run<and_1>($$dpth,
            () => {
                let $scope$left: Nullable<and>;
                let $scope$bool_op: Nullable<string>;
                let $scope$right: Nullable<statement>;
                let $$res: Nullable<and_1> = null;
                if (true
                    && ($scope$left = this.matchand($$dpth + 1, $$cr)) !== null
                    && this.loop<ws>(() => this.matchws($$dpth + 1, $$cr), 0, -1) !== null
                    && ($scope$bool_op = this.regexAccept(String.raw`(?:&)`, "", $$dpth + 1, $$cr)) !== null
                    && this.loop<ws>(() => this.matchws($$dpth + 1, $$cr), 0, -1) !== null
                    && ($scope$right = this.matchstatement($$dpth + 1, $$cr)) !== null
                    && this.loop<ws>(() => this.matchws($$dpth + 1, $$cr), 0, -1) !== null
                ) {
                    $$res = {kind: ASTKinds.and_1, left: $scope$left, bool_op: $scope$bool_op, right: $scope$right};
                }
                return $$res;
            });
    }
    public matchand_2($$dpth: number, $$cr?: ErrorTracker): Nullable<and_2> {
        return this.matchstatement($$dpth + 1, $$cr);
    }
    public matchstatement($$dpth: number, $$cr?: ErrorTracker): Nullable<statement> {
        return this.choice<statement>([
            () => this.matchstatement_1($$dpth + 1, $$cr),
            () => this.matchstatement_2($$dpth + 1, $$cr),
        ]);
    }
    public matchstatement_1($$dpth: number, $$cr?: ErrorTracker): Nullable<statement_1> {
        return this.run<statement_1>($$dpth,
            () => {
                let $scope$not: Nullable<not_statement>;
                let $$res: Nullable<statement_1> = null;
                if (true
                    && ($scope$not = this.matchnot_statement($$dpth + 1, $$cr)) !== null
                    && this.loop<ws>(() => this.matchws($$dpth + 1, $$cr), 0, -1) !== null
                ) {
                    $$res = {kind: ASTKinds.statement_1, not: $scope$not};
                }
                return $$res;
            });
    }
    public matchstatement_2($$dpth: number, $$cr?: ErrorTracker): Nullable<statement_2> {
        return this.matchcomparison($$dpth + 1, $$cr);
    }
    public matchnot_statement($$dpth: number, $$cr?: ErrorTracker): Nullable<not_statement> {
        return this.run<not_statement>($$dpth,
            () => {
                let $scope$value: Nullable<statement>;
                let $$res: Nullable<not_statement> = null;
                if (true
                    && this.regexAccept(String.raw`(?:!)`, "", $$dpth + 1, $$cr) !== null
                    && ($scope$value = this.matchstatement($$dpth + 1, $$cr)) !== null
                ) {
                    $$res = {kind: ASTKinds.not_statement, value: $scope$value};
                }
                return $$res;
            });
    }
    public matchcomparison($$dpth: number, $$cr?: ErrorTracker): Nullable<comparison> {
        return this.choice<comparison>([
            () => this.matchcomparison_1($$dpth + 1, $$cr),
            () => this.matchcomparison_2($$dpth + 1, $$cr),
            () => this.matchcomparison_3($$dpth + 1, $$cr),
        ]);
    }
    public matchcomparison_1($$dpth: number, $$cr?: ErrorTracker): Nullable<comparison_1> {
        return this.run<comparison_1>($$dpth,
            () => {
                let $scope$id: Nullable<id>;
                let $scope$comp_op: Nullable<comp_op>;
                let $scope$value: Nullable<value>;
                let $$res: Nullable<comparison_1> = null;
                if (true
                    && ($scope$id = this.matchid($$dpth + 1, $$cr)) !== null
                    && this.loop<ws>(() => this.matchws($$dpth + 1, $$cr), 0, -1) !== null
                    && ($scope$comp_op = this.matchcomp_op($$dpth + 1, $$cr)) !== null
                    && this.loop<ws>(() => this.matchws($$dpth + 1, $$cr), 0, -1) !== null
                    && ($scope$value = this.matchvalue($$dpth + 1, $$cr)) !== null
                ) {
                    $$res = {kind: ASTKinds.comparison_1, id: $scope$id, comp_op: $scope$comp_op, value: $scope$value};
                }
                return $$res;
            });
    }
    public matchcomparison_2($$dpth: number, $$cr?: ErrorTracker): Nullable<comparison_2> {
        return this.run<comparison_2>($$dpth,
            () => {
                let $scope$id: Nullable<id>;
                let $scope$values: Nullable<value_list>;
                let $$res: Nullable<comparison_2> = null;
                if (true
                    && ($scope$id = this.matchid($$dpth + 1, $$cr)) !== null
                    && this.loop<ws>(() => this.matchws($$dpth + 1, $$cr), 0, -1) !== null
                    && this.regexAccept(String.raw`(?:in)`, "", $$dpth + 1, $$cr) !== null
                    && this.loop<ws>(() => this.matchws($$dpth + 1, $$cr), 0, -1) !== null
                    && this.regexAccept(String.raw`(?:\[)`, "", $$dpth + 1, $$cr) !== null
                    && this.loop<ws>(() => this.matchws($$dpth + 1, $$cr), 0, -1) !== null
                    && ($scope$values = this.matchvalue_list($$dpth + 1, $$cr)) !== null
                    && this.loop<ws>(() => this.matchws($$dpth + 1, $$cr), 0, -1) !== null
                    && this.regexAccept(String.raw`(?:\])`, "", $$dpth + 1, $$cr) !== null
                ) {
                    $$res = {kind: ASTKinds.comparison_2, id: $scope$id, values: $scope$values};
                }
                return $$res;
            });
    }
    public matchcomparison_3($$dpth: number, $$cr?: ErrorTracker): Nullable<comparison_3> {
        return this.run<comparison_3>($$dpth,
            () => {
                let $scope$query: Nullable<or>;
                let $$res: Nullable<comparison_3> = null;
                if (true
                    && this.regexAccept(String.raw`(?:\()`, "", $$dpth + 1, $$cr) !== null
                    && this.loop<ws>(() => this.matchws($$dpth + 1, $$cr), 0, -1) !== null
                    && ($scope$query = this.matchor($$dpth + 1, $$cr)) !== null
                    && this.loop<ws>(() => this.matchws($$dpth + 1, $$cr), 0, -1) !== null
                    && this.regexAccept(String.raw`(?:\))`, "", $$dpth + 1, $$cr) !== null
                ) {
                    $$res = {kind: ASTKinds.comparison_3, query: $scope$query};
                }
                return $$res;
            });
    }
    public matchid($$dpth: number, $$cr?: ErrorTracker): Nullable<id> {
        return this.loop<alphanumeric>(() => this.matchalphanumeric($$dpth + 1, $$cr), 0, -1);
    }
    public matchcomp_op($$dpth: number, $$cr?: ErrorTracker): Nullable<comp_op> {
        return this.choice<comp_op>([
            () => this.matchcomp_op_1($$dpth + 1, $$cr),
            () => this.matchcomp_op_2($$dpth + 1, $$cr),
            () => this.matchcomp_op_3($$dpth + 1, $$cr),
            () => this.matchcomp_op_4($$dpth + 1, $$cr),
            () => this.matchcomp_op_5($$dpth + 1, $$cr),
            () => this.matchcomp_op_6($$dpth + 1, $$cr),
        ]);
    }
    public matchcomp_op_1($$dpth: number, $$cr?: ErrorTracker): Nullable<comp_op_1> {
        return this.regexAccept(String.raw`(?:<=)`, "", $$dpth + 1, $$cr);
    }
    public matchcomp_op_2($$dpth: number, $$cr?: ErrorTracker): Nullable<comp_op_2> {
        return this.regexAccept(String.raw`(?:>=)`, "", $$dpth + 1, $$cr);
    }
    public matchcomp_op_3($$dpth: number, $$cr?: ErrorTracker): Nullable<comp_op_3> {
        return this.regexAccept(String.raw`(?:<)`, "", $$dpth + 1, $$cr);
    }
    public matchcomp_op_4($$dpth: number, $$cr?: ErrorTracker): Nullable<comp_op_4> {
        return this.regexAccept(String.raw`(?:>)`, "", $$dpth + 1, $$cr);
    }
    public matchcomp_op_5($$dpth: number, $$cr?: ErrorTracker): Nullable<comp_op_5> {
        return this.regexAccept(String.raw`(?:==)`, "", $$dpth + 1, $$cr);
    }
    public matchcomp_op_6($$dpth: number, $$cr?: ErrorTracker): Nullable<comp_op_6> {
        return this.regexAccept(String.raw`(?:=)`, "", $$dpth + 1, $$cr);
    }
    public matchvalue($$dpth: number, $$cr?: ErrorTracker): Nullable<value> {
        return this.loop<alphanumeric>(() => this.matchalphanumeric($$dpth + 1, $$cr), 0, -1);
    }
    public matchvalue_list($$dpth: number, $$cr?: ErrorTracker): Nullable<value_list> {
        return this.run<value_list>($$dpth,
            () => {
                let $scope$head: Nullable<value>;
                let $scope$tail: Nullable<value_list_$0[]>;
                let $$res: Nullable<value_list> = null;
                if (true
                    && ($scope$head = this.matchvalue($$dpth + 1, $$cr)) !== null
                    && ($scope$tail = this.loop<value_list_$0>(() => this.matchvalue_list_$0($$dpth + 1, $$cr), 0, -1)) !== null
                ) {
                    $$res = {kind: ASTKinds.value_list, head: $scope$head, tail: $scope$tail};
                }
                return $$res;
            });
    }
    public matchvalue_list_$0($$dpth: number, $$cr?: ErrorTracker): Nullable<value_list_$0> {
        return this.run<value_list_$0>($$dpth,
            () => {
                let $scope$element: Nullable<value>;
                let $$res: Nullable<value_list_$0> = null;
                if (true
                    && this.loop<ws>(() => this.matchws($$dpth + 1, $$cr), 0, -1) !== null
                    && this.regexAccept(String.raw`(?:,)`, "", $$dpth + 1, $$cr) !== null
                    && this.loop<ws>(() => this.matchws($$dpth + 1, $$cr), 0, -1) !== null
                    && ($scope$element = this.matchvalue($$dpth + 1, $$cr)) !== null
                ) {
                    $$res = {kind: ASTKinds.value_list_$0, element: $scope$element};
                }
                return $$res;
            });
    }
    public matchalphanumeric($$dpth: number, $$cr?: ErrorTracker): Nullable<alphanumeric> {
        return this.regexAccept(String.raw`(?:[a-zA-Z0-9]+)`, "", $$dpth + 1, $$cr);
    }
    public matchws($$dpth: number, $$cr?: ErrorTracker): Nullable<ws> {
        return this.regexAccept(String.raw`(?: )`, "", $$dpth + 1, $$cr);
    }
    public test(): boolean {
        const mrk = this.mark();
        const res = this.matchquery(0);
        const ans = res !== null;
        this.reset(mrk);
        return ans;
    }
    public parse(): ParseResult {
        const mrk = this.mark();
        const res = this.matchquery(0);
        if (res)
            return {ast: res, errs: []};
        this.reset(mrk);
        const rec = new ErrorTracker();
        this.clearMemos();
        this.matchquery(0, rec);
        const err = rec.getErr()
        return {ast: res, errs: err !== null ? [err] : []}
    }
    public mark(): PosInfo {
        return this.pos;
    }
    // @ts-ignore: loopPlus may not be called
    private loopPlus<T>(func: $$RuleType<T>): Nullable<[T, ...T[]]> {
        return this.loop(func, 1, -1) as Nullable<[T, ...T[]]>;
    }
    private loop<T>(func: $$RuleType<T>, lb: number, ub: number): Nullable<T[]> {
        const mrk = this.mark();
        const res: T[] = [];
        while (ub === -1 || res.length < ub) {
            const preMrk = this.mark();
            const t = func();
            if (t === null || this.pos.overallPos === preMrk.overallPos) {
                break;
            }
            res.push(t);
        }
        if (res.length >= lb) {
            return res;
        }
        this.reset(mrk);
        return null;
    }
    private run<T>($$dpth: number, fn: $$RuleType<T>): Nullable<T> {
        const mrk = this.mark();
        const res = fn()
        if (res !== null)
            return res;
        this.reset(mrk);
        return null;
    }
    // @ts-ignore: choice may not be called
    private choice<T>(fns: Array<$$RuleType<T>>): Nullable<T> {
        for (const f of fns) {
            const res = f();
            if (res !== null) {
                return res;
            }
        }
        return null;
    }
    private regexAccept(match: string, mods: string, dpth: number, cr?: ErrorTracker): Nullable<string> {
        return this.run<string>(dpth,
            () => {
                const reg = new RegExp(match, "y" + mods);
                const mrk = this.mark();
                reg.lastIndex = mrk.overallPos;
                const res = this.tryConsume(reg);
                if(cr) {
                    cr.record(mrk, res, {
                        kind: "RegexMatch",
                        // We substring from 3 to len - 1 to strip off the
                        // non-capture group syntax added as a WebKit workaround
                        literal: match.substring(3, match.length - 1),
                        negated: this.negating,
                    });
                }
                return res;
            });
    }
    private tryConsume(reg: RegExp): Nullable<string> {
        const res = reg.exec(this.input);
        if (res) {
            let lineJmp = 0;
            let lind = -1;
            for (let i = 0; i < res[0].length; ++i) {
                if (res[0][i] === "\n") {
                    ++lineJmp;
                    lind = i;
                }
            }
            this.pos = {
                overallPos: reg.lastIndex,
                line: this.pos.line + lineJmp,
                offset: lind === -1 ? this.pos.offset + res[0].length : (res[0].length - lind - 1)
            };
            return res[0];
        }
        return null;
    }
    // @ts-ignore: noConsume may not be called
    private noConsume<T>(fn: $$RuleType<T>): Nullable<T> {
        const mrk = this.mark();
        const res = fn();
        this.reset(mrk);
        return res;
    }
    // @ts-ignore: negate may not be called
    private negate<T>(fn: $$RuleType<T>): Nullable<boolean> {
        const mrk = this.mark();
        const oneg = this.negating;
        this.negating = !oneg;
        const res = fn();
        this.negating = oneg;
        this.reset(mrk);
        return res === null ? true : null;
    }
    // @ts-ignore: Memoise may not be used
    private memoise<K>(rule: $$RuleType<K>, memo: Map<number, [Nullable<K>, PosInfo]>): Nullable<K> {
        const $scope$pos = this.mark();
        const $scope$memoRes = memo.get($scope$pos.overallPos);
        if(this.memoSafe && $scope$memoRes !== undefined) {
        this.reset($scope$memoRes[1]);
        return $scope$memoRes[0];
        }
        const $scope$result = rule();
        if(this.memoSafe)
        memo.set($scope$pos.overallPos, [$scope$result, this.mark()]);
        return $scope$result;
    }
}
export function parse(s: string): ParseResult {
    const p = new Parser(s);
    return p.parse();
}
export interface ParseResult {
    ast: Nullable<query>;
    errs: SyntaxErr[];
}
export interface PosInfo {
    readonly overallPos: number;
    readonly line: number;
    readonly offset: number;
}
export interface RegexMatch {
    readonly kind: "RegexMatch";
    readonly negated: boolean;
    readonly literal: string;
}
export type EOFMatch = { kind: "EOF"; negated: boolean };
export type MatchAttempt = RegexMatch | EOFMatch;
export class SyntaxErr {
    public pos: PosInfo;
    public expmatches: MatchAttempt[];
    constructor(pos: PosInfo, expmatches: MatchAttempt[]) {
        this.pos = pos;
        this.expmatches = [...expmatches];
    }
    public toString(): string {
        return `Syntax Error at line ${this.pos.line}:${this.pos.offset}. Expected one of ${this.expmatches.map(x => x.kind === "EOF" ? " EOF" : ` ${x.negated ? 'not ': ''}'${x.literal}'`)}`;
    }
}
class ErrorTracker {
    private mxpos: PosInfo = {overallPos: -1, line: -1, offset: -1};
    private regexset: Set<string> = new Set();
    private pmatches: MatchAttempt[] = [];
    public record(pos: PosInfo, result: any, att: MatchAttempt) {
        if ((result === null) === att.negated)
            return;
        if (pos.overallPos > this.mxpos.overallPos) {
            this.mxpos = pos;
            this.pmatches = [];
            this.regexset.clear()
        }
        if (this.mxpos.overallPos === pos.overallPos) {
            if(att.kind === "RegexMatch") {
                if(!this.regexset.has(att.literal))
                    this.pmatches.push(att);
                this.regexset.add(att.literal);
            } else {
                this.pmatches.push(att);
            }
        }
    }
    public getErr(): SyntaxErr | null {
        if (this.mxpos.overallPos !== -1)
            return new SyntaxErr(this.mxpos, this.pmatches);
        return null;
    }
}